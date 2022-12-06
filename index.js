const express = require('express');
const PORT = 4000;
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const { Server } = require('socket.io');
const socketConnection = require('./socketConnection');

const IO = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

app.use(cors());

socketConnection(IO);

app.get('/api', (req, res) => {
  res.json({
    message: "Hello world"
  })
});

server.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
})