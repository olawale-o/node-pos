const db = require("../../../../models");
const { publishNotificationEvent } = require("../../../v1/event");

const welcomeMessage = (job) => {
  console.log("Sending a welcome message every few seconds");
};

const productNotificationMessage = async (job) => {
  const sendMail = (index, productName, email) => {
    console.log(`${index}: ${productName}: ${email}`);
  };
  const { jobData } = job.data;

  const rows = await db.ProductSubscription.findAll({
    attributes: [
      "product_subscribers.id",
      "product_subscribers.email",
      "subscription.name",
    ],
    where: { productId: jobData.productId },
    include: [
      {
        as: "product_subscribers",
        model: db.User,
        attributes: ["id", "email"],
      },
      {
        as: "subscription",
        model: db.Product,
        attributes: ["name"],
      },
    ],
    limit: 1,
  });
  rows.forEach((row, index) => {
    publishNotificationEvent({
      event: "PRODUCT_NOTIFICATION",
      data: {
        // requestId: "abc123",
        // timestamp: "2024-09-17T14:00:00Z",
        notificationType: "promotional", //"transactional" | "promotional" | "alert",
        channels: ["email", "sms", "push"],
        recipient: {
          userId: row.dataValues.product_subscribers.id,
          email: row.dataValues.product_subscribers.email,
        },
        message: {
          subject: "New Product Arrival",
          body: `We have received new arrival of ${row.dataValues.subscription.name}`,
          attachments: ["https://example.com/invoice123456.pdf"],
          sms: `We have received new arrival of ${row.dataValues.subscription.name}`,
          pushNotification: {
            title: "Product Arrival",
            body: `We have received new arrival of ${row.dataValues.subscription.name}. Check your email for details.`,
            icon: "https://example.com/icon.png",
            action: {
              type: "viewArrival",
              url: "https://example.com/order/123456",
            },
          },
        },
        schedule: {
          sendAt: null, // When to send the notification
        },
        metadata: {
          priority: "medium", // Notification priority (low, medium, high)
          retries: 3, // Number of retry attempts if delivery fails
        },
      },
    });
  });
};

module.exports = { welcomeMessage, productNotificationMessage };
