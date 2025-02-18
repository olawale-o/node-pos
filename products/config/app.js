const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("../middleware/errorHandler");
const workers = require("../api/v1/jobs/bull/worker");
const os = require("os");
const { cpuUsage } = require("process");

//const { consume: runConsumer } = require("../kafka/consumer.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

workers.forEach((worker) => {
  worker.on("completed", async (job) => {
    console.log(`${job.id} has completed!`);
  });

  worker.on("failed", (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
  });
});

app.get("/health", (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    responseTime: process.hrtime(),
    message: "OK",
    timestamp: Date.now(),
    osuptime: os.uptime(),
    pid: process.pid,
    memoryUsage: process.memoryUsage().rss,
    title: process.title,
    version: process.version,
    versions: process.versions,
    cpuUsage: process.cpuUsage(),
  };

  try {
    return res.status(200).json(healthcheck);
  } catch (e) {
    healthcheck.message = e;
    return res.status(503).json(healthcheck);
  }
});
app.use("/app-event", require("../api/v1/app-event"));
app.use(require("../api/v1/index"));
app.use(errorHandler);

// runConsumer()
//   .then(() => {
//     console.log("Consumer is running...");
//   })
//   .catch((error) => {
//     console.error("Failed to run kafka consumer", error);
//   });
//

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

module.exports = app;
