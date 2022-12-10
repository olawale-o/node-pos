const  env = require('./constants');
const http = require('http');
const { PORT } = env;

const app = require('./config/app');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');

const dbConnection = require('./database/connection');
const socketConnection = require('./socketConnection');

const IO = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

socketConnection(IO);
dbConnection(MongoClient)
.then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err)
})

server.listen(PORT || 5001, () => {
  console.log('Server started on port 5001');
});

module.exports = server; 