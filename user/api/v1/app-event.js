const router = require("express").Router();

router.use("/", async (req, res, next) => {
  res.status(200).json({ status: true });
});

module.exports = router;
