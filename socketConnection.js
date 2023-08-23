const { MongoClient, ObjectId } = require('mongodb');

const { MongoDBMessageStorage, InMemoryMessageStorage } = require('./messageStorage');
const { InMemmoryStore, RedisSessionStorage } = require('./sessionStorage');
const { LOCAL_MONGODB_SINGLESET } = require('./config');
const client = new MongoClient(LOCAL_MONGODB_SINGLESET);

const memoryStorage = new InMemoryMessageStorage();

const mongoStorage = new MongoDBMessageStorage(client);

// const memorySession = new InMemmoryStore();

const User = client.db('socialdb').collection('users');

const fetchUsersFromDB = async (userId) => {
  return await User.find({ _id: { $ne: ObjectId(userId) }}).toArray();
}

const getMessagesForUserFromDB = async (userId) => {
  const messagesPerUser = new Map();
  const messages = await mongoStorage.findMessagesForUserFromDB(userId);
  messages.forEach((message) => {
    const { from, to } = message;
    const otherUser = userId.toString() === from.toString() ? to.toString() : from.toString();
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message])
    }
  });
  return messagesPerUser;
}

const getMessagesForUser = (userId) => {
  const messagesPerUser = new Map();
  memoryStorage.findMessagesForUser(userId).forEach((message) => {
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

module.exports = function(IO, redisClient) {
  const redisSession = new RedisSessionStorage(redisClient);
  IO.use(async (socket, next) => {
    const sessionId = socket.handshake.auth.sessionId;
    if (sessionId) {
      const session = await redisSession.findSession(sessionId);
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
    await redisSession.saveSession(socket.sessionId, {
      userId: socket.userId,
      username: socket.username,
      _id: socket.userId,
      online: true,
    })
    await socket.join(socket.userId);
    const users = []
    const userMessages = await getMessagesForUserFromDB(socket.userId) // getMessagesForUser(socket.userId)
    const a = await fetchUsersFromDB(socket.userId)
    // find all connected users except the current user
    // const s = await redisSession.findSessions();
    // s.forEach((session) => {
    //   if (session.userId !== socket.userId) {
    //     users.push({
    //       userId: session.userId,
    //       username: session.username,
    //       online: session.online,
    //       _id: session._id,
    //       messages: userMessages.get(session.userId) || [],
    //     })
    //   }
    // })

    for (const user of a) {
      const u = await redisSession.findSession(user._id.toString())
      if (u === null) {
        users.push({
          userId: user._id,
          username: user.username,
          online: user.online,
          _id: user._id,
          messages: userMessages.get(user._id.toString()) || [],
        })
      } else {
        users.push({
          userId: u?.userId,
          username: u?.username,
          online: u?.online,
          _id: u?._id,
          messages: userMessages.get(user._id.toString()) || [],
        })
      }
    }
  
    await socket.emit('session', {
      sessionId: socket.sessionId,
      userId: socket.userId,
      username: socket.username,
      _id: socket._id,
      online: true,
    });
    // all connected users except current user
    await socket.emit("users", users);

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
      socket.to(to).emit("private message", newMessage);
      // memoryStorage.saveMessages(newMessage);
      await mongoStorage.saveMessagesToDB({ from: ObjectId(socket.userId), to: ObjectId(to), text })
    })

    socket.on('new message', (message) => {
      socket.broadcast.emit('new message', {
        userId: socket.userId,
        username: socket.username,
        message,
      })
    });

    socket.on('user messages', async ({ _id, username }) => {
      const userMessages = await getMessagesForUserFromDB(socket._id) // getMessagesForUser(socket._id);
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
        await redisSession.saveSession(socket.sessionId, {
          userId: socket.userId,
          username: socket.username,
          online: socket.online,
          _id: socket._id
        })
      }
    });
  })
}