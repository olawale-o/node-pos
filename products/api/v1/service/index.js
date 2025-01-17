const db = require("../../../models");
const { Op } = require("sequelize");

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

  update: async (payload) => {
    const updated = await db.Product.update(
      { quantity: payload.data.quantity },
      { where: { id: payload.productId }, individualHooks: true },
    );

    if (updated) {
      return updated;
    }

    throw new Error("Unable to update product");
  },

  clearProductSubscribers: async (payload) => {
    const data = [];
    data.push({ user_id: payload.user_id, productId: payload.productId });
    const isDeleted = await db.Product_Subscription.destroy({
      where: {
        [Op.or]: data,
      },
    });
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
