const axios = require("axios");
module.exports = {
  publishProductEvent: async (payload) => {
    await axios.post("http://localhost:5000/api/products/app-event", {
      payload,
    });
  },
  consumeEvent: async (payload) => {
    const { data, event } = payload;
    switch (event) {
      case "PRODUCT_SUBSCRIPTION":
        // send mail to the user
        console.log(data);
        break;
      default:
        break;
    }
  },
};
