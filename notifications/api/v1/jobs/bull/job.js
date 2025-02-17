// const db = require("../../../../models");
const { produce } = require("../../../../kafka/producer");

const welcomeMessage = (job) => {
  console.log("Sending a welcome message every few seconds");
};

const productNotificationMessage = async (job) => {};

module.exports = { welcomeMessage, productNotificationMessage };
