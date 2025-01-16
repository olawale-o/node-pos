const { emailQueue } = require("./bull/queue");
const { addJob } = require("./bull");
module.exports = {
  notifyProductSubscribers: (sequelize) => async (instance, options) => {
    const rows = await sequelize.models.Product_Subscription.findAll({
      where: { productId: instance.dataValues.id },
      include: {
        as: "product_subscribers",
        model: sequelize.models.User,
      },
      limit: 100,
    });
    console.log(rows);
    // rows.forEach((row) => {
    //   row.dataValues.subscribers.forEach((subscriber) => {
    //     addJob(emailQueue, {
    //       name: "productNotificationMessage",
    //       jobData: { email: subscriber.dataValues.email },
    //     });
    //   });
    // });
  },
};
