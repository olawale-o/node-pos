const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const errorHandler = require('../middleware/errorHandler');
const socketConnection = require('../socketConnection');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const server = http.createServer(app);
const IO = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});
app.use('/v1', require('../route')(IO));

app.use(errorHandler);

socketConnection(IO);

module.exports = server;