// const { emailQueue } = require("../api/v1/jobs/bull/queue");
// const { addJob } = require("../api/v1/jobs/bull");
//
const emailMessageHandler = (data) => {
  console.log("Handling email notification:", data.recipient.email);
};
const smsMessageHandler = (data) => {
  console.log("Handling SMS notification:", message.value.toString());
};

const handleMessage =
  (consumer) =>
  async ({ topic, partition, message }) => {
    const data = JSON.parse(message.value);
    console.log(
      `Received message from topic '${topic}': '${partition}': ${data.toString()}`,
    );

    if (topic === "email-topic") {
      emailMessageHandler(data);
    } else if (topic === "sms-topic") {
      smsMessageHandler(data);
    } else {
      console.log("Unknown topic:", topic);
    }
    await consumer.commitOffsets([
      { topic, partition, offset: message.offset },
    ]);
  };

module.exports = { handleMessage };
