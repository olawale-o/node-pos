const { PORT } = require('./config');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const { Server } = require('socket.io');
const socketConnection = require('./socketConnection');
const sConnection = require('./sConnection');
const { MongoClient } = require('mongodb');
const dbConnection = require('./database/connection');

const Redis = require('ioredis')
const { createAdapter } = require('socket.io-redis');

const redisClient = new Redis()

const IO = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST']
  },
  adapter: createAdapter({
    pubClient: redisClient,
    subClient: redisClient.duplicate()
  })
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

socketConnection(IO, redisClient);

dbConnection(MongoClient)
.then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err)
})

app.use('/api/v1/users', require('./routes/user')(IO));
app.use('/api/v1/conversations', require('./messageRoute')(IO));

app.get('/api', (req, res) => {
  res.json({
    message: "Hello world"
  })
});

server.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
})