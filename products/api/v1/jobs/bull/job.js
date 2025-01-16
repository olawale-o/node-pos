const welcomeMessage = (job) => {
  console.log("Sending a welcome message every few seconds");
};

const productNotificationMessage = (job) => {
  console.log(
    "Sending a product notification message to " + job.data.jobData.email,
  );
};

module.exports = { welcomeMessage, productNotificationMessage };
