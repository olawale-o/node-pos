// const db = require("../../../models");
const { Op } = require("sequelize");
const { produce } = require("../../../kafka/producer");
const { emailQueue } = require("../jobs/bull/queue");
const { addJob } = require("../jobs/bull");

module.exports = {
  create: async (payload) => {},

  sendNotification: async (payload) => {
    const { recipient, message } = payload;
    console.log(recipient);
    console.log(message);
  },
};
