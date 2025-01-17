const { emailQueue } = require("./bull/queue");
const { addJob } = require("./bull");
module.exports = {
  notifyProductSubscribers: (sequelize) => async (instance, options) => {
    const productId = instance.dataValues.id;
    const rows = await sequelize.models.Product_Subscription.findAll({
      where: { productId },
      include: {
        as: "product_subscribers",
        model: sequelize.models.User,
      },
      limit: 100,
    });

    rows.forEach((row) => {
      const subscriber = row.dataValues.product_subscribers;
      addJob(
        emailQueue,
        {
          name: "productNotificationMessage",
          jobData: {
            user_id: subscriber.id,
            productId,
            email: subscriber.dataValues.email,
          },
        },
        { removeOnComplete: true },
      );
    });
  },
};
