const env = require("./constants");
const http = require("http");
const { PORT } = env;

const app = require("./config/app");
const server = http.createServer(app);

server.listen(PORT || 5003, () => {
  console.log("Server started on port 5003");
});

module.exports = server;
