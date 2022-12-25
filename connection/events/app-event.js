const connectionService = require('../services/connection-service');

module.exports = (app) => {
  app.use('/v1/app-event', async (req, res,) => {
    const { payload } = req.body;
    await connectionService.subscribeEvents(payload);
    console.log("====== Event hookfired for connection request =====");
    return res.status(200).json({ payload });
  })
}