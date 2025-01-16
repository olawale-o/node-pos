const { Worker } = require("bullmq");
const jobHandlers = require("./handlers");
const redisOptions = { host: "localhost", port: 6379 };

const processJob = async (job) => {
  const handler = jobHandlers[job.name];

  if (handler) {
    console.log(`Processing job: ${job.name}`);
    await handler(job);
  }
};

const emailWorker = new Worker("email", processJob, {
  connection: redisOptions,
});
const productWorker = new Worker("product", processJob, {
  connection: redisOptions,
});

module.exports = [emailWorker, productWorker];
