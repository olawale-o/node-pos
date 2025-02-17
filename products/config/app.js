const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("../middleware/errorHandler");
const workers = require("../api/v1/jobs/bull/worker");

// const { consume: runConsumer } = require("../kafka/consumer.js");

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

module.exports = app;
