const { Queue } = require("bullmq");
const redisOptions = { host: "localhost", port: 6379 };

const emailQueue = new Queue("email", { connection: redisOptions });
const productQueue = new Queue("product", { connection: redisOptions });

module.exports = { emailQueue, productQueue };
