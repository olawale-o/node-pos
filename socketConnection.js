let users = [];
module.exports = function(IO) {
  IO.on('connection', (socket) => {
    console.log(`${socket.id} just connected`);

    socket.on('message', (data) => {
        console.log(data)
        IO.emit('serverReply', data);
    })

    socket.on('online', (data) => {
        users.push(data);
        IO.emit('appearance', users)
    });

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

    socket.on('doneTyping', (data) => {
        console.log(data);
        socket.broadcast.emit('doneTypingResponse', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    })
  });
}