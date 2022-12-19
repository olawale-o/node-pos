const { LOCAL_MONGODB_SINGLESET } = require('./config');
const { MongoClient } = require('mongodb');
const { ObjectID } = require('bson');

const client = new MongoClient(LOCAL_MONGODB_SINGLESET);

const User = client.db('socialdb').collection('users');

let users = [];
let onlineUsers = {};
module.exports = function(IO) {
  IO.on('connection', (socket) => {
    console.log(`${socket.id} just connected`);

    socket.on('message', (data) => {
      IO.emit('serverReply', data);
    })

    socket.on('online', async (data) => {
      const newUser = await User.findOneAndUpdate(
          { _id: ObjectID(data.id) },
          { $set: { online: true, socketId: data.socketID } },
          { returnDocument: true }
        );
      if (newUser.value) {
        users.push(data.id);
        onlineUsers[data.socketID] = data.id
        IO.emit('appearance', users)
      }
    });

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

    socket.on('doneTyping', (data) => {
      console.log(data);
      socket.broadcast.emit('doneTypingResponse', data);
    });

    socket.on('private message', (data) => {
      console.log(data)
      IO.to(data.recipientSocketId).to(data.senderSocketId).emit('private message', { data, socketId: socket.id })
    });

    socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    socket.on('disconnect', async (reason) => {
      const newUser = await User.findOneAndUpdate(
        { socketId: socket.id },
        { $set: { online: false, socketId: '' } },
      );
      if (newUser.value) {
        const userId = onlineUsers[socket.id];
        delete onlineUsers[socket];
        const userIds = users.filter((id) => id !== userId);
        IO.emit('appearance', userIds)
      }
    });
  });
}