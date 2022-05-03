const http = require('http');

const app = require('./config/app');
const server = http.createServer(app);

server.listen(5001, () => {
  console.log('Server started on port 5000');
});

module.exports = server;