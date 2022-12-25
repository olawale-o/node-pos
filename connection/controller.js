const connectionService = require('./services/connection-service');

module.exports = {
  friendRequest: async (req, res, next) => {
    const { requester, recipient } = req.body;
    try {
      const requestId = await connectionService.friendRequest({ recipient, requester });
      return res.status(200).json({ id: requestId })
    } catch (error) {
      console.log(error);
    }  
  }
};
