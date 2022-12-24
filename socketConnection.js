const { LOCAL_MONGODB_SINGLESET } = require('./config');
const { MongoClient } = require('mongodb');

const client = new MongoClient(LOCAL_MONGODB_SINGLESET);

const User = client.db('socialdb').collection('users');

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
      console.log('session', session)
      if (session) {
        socket.sessionId = sessionId;
        socket.userId = session.userId;
        socket._id = session.userId;
        socket.username = session.username;
        return next();
      } else {
        return next(new Error("Invalid session"))
      }
    }
    const user = socket.handshake.auth.user;
    if (!user) {
     return next(new Error('invalid user details'));
    }
    // console.log('line 69', user);
    socket.username = user.username;
    socket.userId = user._id;
    socket._id = user._id;
    socket.sessionId = user._id;
    next()
  })

  IO.on('connection', async (socket) => {
    saveSession(socket.sessionId, {
      userId: socket.userId, username: socket.username, _id: socket._id,
      connected: true,
    })
    await socket.join(socket.userId);
    const users = []
    const userMessages = getMessagesForUser(socket.userId)
    findSessions().forEach((session) => {
      if (session.userId !== socket.userId) {
        users.push({
          userId: session.userId,
          username: session.username,
          connected: session.connected,
          _id: session._id,
          messages: userMessages.get(session.userId) || [],
        })
      }
    })
  
    await socket.emit('session', {
      sessionId: socket.sessionId, userId: socket.userId, username: socket.username, _id: socket._id,
    });
    // all connected users
    await socket.emit("users", users);

    await socket.broadcast.emit('user connected', {
      userId: socket.userId,
      username: socket.username,
      sessionId: socket.sessionId,
      _id: socket._id,
    });
    socket.on('private message', ({ text, to }) => {
      const newMessage = {
        from: socket.userId,
        to,
        text,
        username: socket.username
      }
      console.log('newMessage', newMessage);
      socket.to(to).emit("private message", newMessage);
      saveMessages(newMessage);
    })

    socket.on('new message', (message) => {
      socket.broadcast.emit('new message', {
        userId: socket.userId,
        username: socket.username,
        message,
      })
    });

    socket.on('user messages', ({ _id, username }) => {
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
  })
}