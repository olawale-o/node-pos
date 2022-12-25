const userService = require('./services/user-service');
const publisher = require('./events/publisher');

module.exports = {
  create: async (req, res) => {
    const { username, password, name } = req.body;
    try {
      const user = await userService.register(
        { username, password, name, createdAt: new Date(), updatedAt: new Date() }
      );
      return res.status(201).json(user);  
    } catch (error) {
      console.log(error);
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await userService.login({ username, password });
      return res.status(201).json(user);  
    } catch (error) {
      console.log(error);
    }
  },
  createUser: async (req, res) => {
    const { username, name } = req.body;
    try {
      const user = await userService.register(
        { username, name, createdAt: new Date(), updatedAt: new Date() }
      );
      return res.status(201).json(user);  
    } catch (error) {
      console.log(error);
    }
  },
  myFriendRequest: async (req, res) => {
    const { userId } = req.body;
    try {
      const payload = await userService.getPendingConnectionPayload({ userId }, 'GET_PENDING_REQUEST');
      await publisher.PublishConnectionEvent(payload);
      return res.status(201).json(payload);  
    } catch (error) {
      console.log(error);
    }
  }
}