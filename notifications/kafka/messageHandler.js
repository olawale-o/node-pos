// const { emailQueue } = require("../api/v1/jobs/bull/queue");
// const { addJob } = require("../api/v1/jobs/bull");
const handleMessage =
  (consumer) =>
  async ({ topic, partition, message }) => {
    const data = JSON.parse(message.value);
    console.log(
      `Received message from topic '${topic}': '${partition}': ${data.toString()}`,
    );

    if (topic === "email-topic") {
      console.log("Handling email notification:", data.email);
    } else if (topic === "sms-topic") {
      console.log("Handling SMS notification:", message.value.toString());
    } else {
      console.log("Unknown topic:", topic);
    }
    await consumer.commitOffsets([
      { topic, partition, offset: message.offset },
    ]);
  };

module.exports = { handleMessage };
