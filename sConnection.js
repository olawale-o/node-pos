const { LOCAL_MONGODB_SINGLESET } = require('./config');
const { MongoClient } = require('mongodb');
const { ObjectID } = require('bson');

const client = new MongoClient(LOCAL_MONGODB_SINGLESET);

const User = client.db('socialdb').collection('users');
const Conversation = client.db('socialdb').collection('conversations');

let onlineUsers = {};

const sessions = new Map();
const messages = [];

const findSession = (id) => {
  return sessions.get(id)
}

const saveSession = (id, session) => {
  sessions.set(id, session);
};

const findSessions = () => {
  return [...sessions.values()];
}

const saveMessages = (message) => {
  messages.push(message);
}

const findMessagesForUser = (userId) => {
  return messages.filter((message) => message.from === userId || message.to === userId)
}

const getMessagesForUser = (userId) => {
  const messagesPerUser = new Map();
  findMessagesForUser(userId).forEach((message) => {
    const { from, to } = message;
    const otherUser = userId === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message])
    }
  });
  return messagesPerUser;
}

module.exports = function(IO) {
  IO.use(async (socket, next) => {
    const sessionId = socket.handshake.auth.sessionId;
    if (sessionId) {
      const session = await findSession(sessionId);
      if (session) {
        socket.sessionId = sessionId;
        socket.userId = session.userId
        socket.username = session.username;
        socket._id = session._id;
        return next();
      } else {
        return next(new Error("Invalid session"))
      }
    }
    const user = socket.handshake.auth.user;
    if (!user) {
     return next(new Error('invalid user details'));
    }
    socket.username = user.username;
    socket.userId = user._id;
    socket.sessionId = user._id;
    socket._id = user._id;
    next()
  })

  IO.on('connection', async (socket) => {
    saveSession(socket.sessionId, {
      userId: socket.userId, username: socket.username, _id: socket._id,
      online: true,
    })
    await socket.join(socket.userId);
    const users = [];
    const userMessages = getMessagesForUser(socket.userId)
    findSessions().forEach((session) => {
      if (session.userId !== socket.userId) {
        users.push({
          userId: session.userId,
          username: session.username,
          connected: session.connected,
          messages: userMessages.get(session.userId) || [],
        })
      }
    })
    // connect to database and update user online status
    await User.findOneAndUpdate({ _id: ObjectID(socket.userId)}, { $set: { online: true } })
    await socket.emit('session', { sessionId: socket.sessionId, userId: socket.userId, username: socket.username });
    // all connected users

    // get all user's follower
    const onlineFollowers = await User.find({_id: {$ne: ObjectID(socket.userId) }}).toArray();
    socket.emit("users", onlineFollowers)

    await socket.broadcast.emit('user connected', {
      userId: socket.userId,
      username: socket.username,
      sessionId: socket.sessionId,
      _id: socket._id,
    });

    socket.on('private message', async ({ text, to }) => {
      const newMessage = {
        from: socket.userId,
        to,
        text,
        username: socket.username
      }
      console.log('new private message')
      await Conversation.insertOne({
        from: socket.userId,
        to,
        text,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      });
      socket.to(to).emit("private message", newMessage);
      saveMessages(newMessage);
    });

    socket.on('user messages', ({ _id, username }) => {
      // pull messages from database
      const userMessages = getMessagesForUser(socket._id);
      console.log(userMessages);
      console.log(userMessages.get(_id));
      socket.emit('user messages', {
        userId: _id,
        _id,
        username,
        messages: userMessages.get(_id) || []
      })
    });

    socket.on('disconnect', async () => {
      const matchingSockets = await IO.in(socket.userId).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        await User.findOneAndUpdate({ _id: ObjectID(socket.userId) }, { $set: { online: false } })
        socket.broadcast.emit('user disconnected', {
          userId: socket.userId,
          username: socket.username,
        })
        saveSession(socket.sessionId, {
          userId: socket.userId,
          username: socket.username,
          connected: socket.connected
        })
      }
    });

    // socket.on('user messages', ({ userId, username }) => {
    //   const userMessages = getMessagesForUser(userId);
    //   socket.emit('user messages', {
    //     userId,
    //     username,
    //     messages: userMessages.get(userId) || [],
    //   });
    // });
  })
}