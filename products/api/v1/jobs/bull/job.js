const db = require("../../../../models");

const welcomeMessage = (job) => {
  console.log("Sending a welcome message every few seconds");
};

const productNotificationMessage = async (job) => {
  const sendMail = (index, proudct, email) => {
    console.log(
      index + " Sending product notification " + proudct + " to " + email,
    );
  };
  const { jobData } = job.data;

  const rows = await db.ProductSubscription.findAll({
    where: { productId: jobData.productId },
    include: {
      as: "product_subscribers",
      model: db.User,
    },
  });
  rows.forEach((row, index) => {
    sendMail(
      index,
      row.dataValues.productId,
      row.dataValues.product_subscribers.email,
    );
  });
};

module.exports = { welcomeMessage, productNotificationMessage };
