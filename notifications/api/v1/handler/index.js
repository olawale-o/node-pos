const service = require("../service");
const { publishUserEvent } = require("../event");

module.exports = {
  new: async (req, res, next) => {
    try {
      const data = req.body;
      const product = await service.create(data);

      res.status(200).json({ product });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  index: async (req, res, next) => {},
  show: async (req, res, next) => {},
};
