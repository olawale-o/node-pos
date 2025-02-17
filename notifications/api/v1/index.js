const handler = require("./handler");

const router = require("express").Router();

router.get("/", handler.index);
router.get("/:id", handler.show);
router.post("/", handler.new);

module.exports = router;
