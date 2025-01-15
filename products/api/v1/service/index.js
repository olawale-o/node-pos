const db = require("../../../models");

module.exports = {
  create: async (payload) => {
    const product = await db.Product.create({
      ...payload,
    });
    if (product) {
      return product;
    }

    throw new Error("Unable to create product");
  },
  subscribe: async (payload) => {
    const product = await db.Product_Subscription.create({
      ...payload,
    });

    if (product) {
      return product;
    }

    throw new Error("Unable to subscribe to product");
  },

  getProductPayload: async (productId, userId, event) => {
    const product = await db.Product.findOne({ where: { id: productId } });
    if (product) {
      const payload = {
        event,
        data: { userId, product },
      };
      return payload;
    } else {
      throw new Error("User does not exist");
    }
  },
};
