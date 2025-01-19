const service = require("../service");
const { publishUserEvent } = require("../event");

module.exports = {
  new: async (req, res, next) => {
    try {
      const data = req.body;
      const product = await service.create(data);

      res.status(200).json({ product });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  subscribe: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const data = req.body;

      const product = await service.subscribe({
        productId,
        user_id: data.userId,
      });
      if (!product) {
        throw new Error("Unable to subscribe to product");
      }
      // const payload = await service.getProductPayload(
      //   productId,
      //   data.userId,
      //   "PRODUCT_SUBSCRIPTION",
      // );
      // await publishUserEvent(payload);
      res.status(200).json({ message: "Thank you for subscribing" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server error" });
    }
  },
  update: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const data = req.body;
      await service.update({ productId, data });
      res.status(200).json({ message: "Product updated" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
