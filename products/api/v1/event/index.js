const axios = require("axios");
module.exports = {
  publishUserEvent: async (payload) => {
    await axios.post("http://localhost:5000/api/users/app-event", {
      payload,
    });
  },
  consumeEvent: async (payload) => {
    const { data, event } = payload;
    switch (event) {
      case "PRODUCT_SUBSCRIPTION":
        break;
      default:
        break;
    }
  },
};
