const { Kafka, Partitioners } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-producer",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

const produce = async ({ topic, message }) => {
  await producer.connect();
  await producer.send({
    topic: topic,
    messages: [
      {
        value: message,
      },
    ],
  });
};

module.exports = { produce };
