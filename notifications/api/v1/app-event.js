const event = require("./event");

const router = require("express").Router();

router.use("/", async (req, res) => {
  const { payload } = req.body;
  await event.consumeEvent(payload);
  res.status(200).json({ status: true });
});

module.exports = router;
