const handler = require("./handler");

const router = require("express").Router();

router.post("/signup", handler.register);
router.post("/subscribe", handler.subscribeToProduct);

module.exports = router;
