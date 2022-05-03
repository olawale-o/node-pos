const  env = require('./constants');
const http = require('http');
const { PORT } = env;

const app = require('./config/app');
const server = http.createServer(app);

server.listen(PORT || 5001, () => {
  console.log('Server started on port 5001');
});

module.exports = server;