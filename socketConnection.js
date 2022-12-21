const { LOCAL_MONGODB_SINGLESET } = require('./config');
const { MongoClient } = require('mongodb');
const { ObjectID } = require('bson');

const client = new MongoClient(LOCAL_MONGODB_SINGLESET);

const User = client.db('socialdb').collection('users');

let users = [];
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
  const messagesForsUser = new Map();
  findMessagesForUser(userId).forEach((message) => {
    const { from, to } = message;
    const otherUser = userId === from ? to : from;
    if (messagesForsUser.has(otherUser)) {
      messagesForsUser.get(otherUser).push(message);
    } else {
      messagesForsUser.set(otherUser, [message])
    }
  })
}


module.exports = function(IO) {
  IO.use((socket, next) => {
    const sessionId = socket.handshake.auth.sessionId;
    if (sessionId) {
      const session = findSession(sessionId);
      console.log('session', session)
      if (session) {
        socket.sessionId = sessionId;
        socket.userId = session.userId
        socket.username = session.username;
        return next();
      } else {
        return next(new Error("Invalid session"))
      }
    }
    const user = socket.handshake.auth.user;
    console.log('line 64', user);
    if (!user) {
      return next(new Error('invalid user details'));
    }
    socket.username = user.username;
    socket.userId = user._id;
    socket.sessionId = user._id;
    next()
  })

  IO.on('connection', async (socket) => {
    saveSession(socket.sessionId, {
      userId: socket.userId, username: socket.username,
      connected: true,
    })
    socket.join(socket.userId);
    // all connected users
    const users = []
    // const userMessages = getMessagesForUser(socket.userId)
    for (let [id, socket] of IO.of('/').sockets) {
      users.push({
        userId: socket.userId,
        username: socket.username
      })
    }
    // findSessions().forEach((session) => {
    //   if (session.userId !== socket.userId) {
    //     users.push({
    //       userId: session.userId,
    //       username: session.username,
    //       connected: session.connected,
    //       messages: userMessages.get(session.userId) || [],
    //     })
    //   }
    // })
    socket.emit("users", users);

    socket.emit('session', { sessionId: socket.sessionId, userId: socket.userId, username: socket.username });

    socket.on('private message', ({ content, to }) => {
      const newMessage = {
        from: socket.userId,
        to,
        content
      }
      socket.to(to).emit("private message", newMessage);
      saveMessages(newMessage);
    })

    // socket.on('user messages', ({ userId, username }) => {
    //   const userMessages = getMessagesForUser(userId);
    //   socket.emit('user messages', {
    //     userId,
    //     username,
    //     messages: userMessages.get(userId) || [],
    //   });
    // });
  })


  // IO.on('connection', (socket) => {
  //   console.log(`${socket.id} just connected`);

  //   socket.on('message', (data) => {
  //     IO.emit('serverReply', data);
  //   })

  //   socket.on('online', async (data) => {
  //     console.log('online', data);
  //     const newUser = await User.findOneAndUpdate(
  //         { _id: ObjectID(data.id) },
  //         { $set: { online: true, socketId: data.socketID } },
  //         { returnDocument: true }
  //       );
  //     if (newUser.value) {
  //       users.push(data.id);
  //       onlineUsers[data.socketID] = data.id
  //       IO.emit('appearance', users)
  //     }
  //   });

  //   socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

  //   socket.on('doneTyping', (data) => {
  //     console.log(data);
  //     socket.broadcast.emit('doneTypingResponse', data);
  //   });

  //   socket.on('private message', (data) => {
  //     console.log(data)
  //     IO.to(data.recipientSocketId).to(data.senderSocketId).emit('private message', { data, socketId: socket.id })
  //   });

  //   // socket.onAny((event, ...args) => {
  //   //   console.log(event, args);
  //   // });

  //   socket.on('disconnect', async (reason) => {
  //     console.log(socket.id)
  //     const newUser = await User.findOneAndUpdate(
  //       { socketId: socket.id },
  //       { $set: { online: false, socketId: '' } },
  //     );
  //     if (newUser.value) {
  //       const userId = onlineUsers[socket.id];
  //       delete onlineUsers[socket.id];
  //       const userIds = users.filter((id) => id !== userId);
  //       IO.emit('appearance', userIds)
  //     }
  //   });
  // });
}