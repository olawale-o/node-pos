const router = require("express").Router();

router.post("/login", async (req, res, next) => {
  res.status(200).json({ status: true, route: "login" });
});

module.exports = router;
