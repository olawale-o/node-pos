const { PORT } = require('./config');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const { Server } = require('socket.io');
const socketConnection = require('./socketConnection');
const { MongoClient } = require('mongodb');
const dbConnection = require('./database/connection');

const IO = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

app.use(cors());

socketConnection(IO);

dbConnection(MongoClient)
.then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err)
})
// .finally(() => dbConnection);

app.get('/api', (req, res) => {
  res.json({
    message: "Hello world"
  })
});

server.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
})