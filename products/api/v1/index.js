const router = require("express").Router();

router.post("/", async (req, res, next) => {
  res.status(200).json({ status: true, route: "products" });
});

module.exports = router;
