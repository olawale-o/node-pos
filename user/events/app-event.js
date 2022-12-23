const userService = require('../services/user-service');

module.exports = (app) => {
  app.use('/v1/app-event', async (req, res,) => {
    const { payload } = req.body;
    await userService.subscribeEvents(payload);
    console.log("====== Event hookfired=====");
    return res.status(200).json({ payload });
  })
}