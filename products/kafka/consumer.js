const { Kafka } = require("kafkajs");
const { handleMessage } = require("./messageHandler");

const kafka = new Kafka({
  clientId: "my-consumer",
  brokers: ["localhost:9092"],
  logLevel: 0,
});

const consumer = kafka.consumer({ groupId: "notification-group" });

const consume = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "email-topic", fromBeginning: true });
  await consumer.subscribe({ topic: "sms-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: handleMessage(consumer),
  });
};

module.exports = { consume };
