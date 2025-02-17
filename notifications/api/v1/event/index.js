const axios = require("axios");
const service = require("../service");
module.exports = {
  publishUserEvent: async (payload) => {
    await axios.post("http://localhost:5000/api/users/app-event", {
      payload,
    });
  },
  consumeEvent: async (payload) => {
    const { data, event } = payload;
    switch (event) {
      case "PRODUCT_NOTIFICATION":
        await service.sendNotification(data);
      default:
        break;
    }
  },
};
