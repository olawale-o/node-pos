const handler = require("./handler");

const router = require("express").Router();

router.post("/", handler.new);
router.post("/:productId/subscribe", handler.subscribe);

module.exports = router;
