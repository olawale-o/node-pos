const { publishProductEvent } = require("../event");
const { create, getUserPayload } = require("../service");

module.exports = {
  register: async (req, res, next) => {
    try {
      const data = req.body;
      const user = await create(data);
      res.status(200).json({ user });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server error" });
    }
  },
  subscribeToProduct: async (req, res, next) => {
    try {
      const data = req.body;
      const payload = await getUserPayload(
        data.userId,
        data.product,
        "PRODUCT_SUBSCRIPTION",
      );
      await publishProductEvent(payload);
      res.status(200).json({ message: "Thank you for subscribing" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server error" });
    }
  },
};
