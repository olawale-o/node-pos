const { welcomeMessage, productNotificationMessage } = require("./job");

const jobHandlers = {
  welcomeMessage: welcomeMessage,
  productNotificationMessage: productNotificationMessage,
};

module.exports = jobHandlers;
