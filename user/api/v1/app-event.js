const { consumeEvent } = require("./event");

const router = require("express").Router();

router.use("/", async (req, res, next) => {
  const { payload } = req.body;
  await consumeEvent(payload);
  res.status(200).json({ status: true });
});

module.exports = router;
