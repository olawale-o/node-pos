const userService = require('./services/user-service');
const publisher = require('./events/publisher');
const tokenService = require('./services/token-service');

module.exports = {
  create: async (req, res) => {
    const { username, password, name } = req.body;
    try {
      const user = await userService.register(
        { username, password, name, createdAt: new Date(), updatedAt: new Date() }
      );
      if (!user) {
        console.log('error');
      }
      const accessToken = await tokenService.signAccessToken({ userId: user.insertedId });
      const refreshToken = await tokenService.signRefreshToken({ userId: user.insertedId });
      await userService.updateToken(user.insertedId, { $set: { accessToken, refreshToken } });
      res.cookie('jwt', refreshToken, {
        httpOnly: true, sameSite: 'None', secure: true, maxAge: 1000 * 60 * 60 * 24,
      });
      return res.status(201).json({
        id: user.insertedId,
        name,
        username,
      });  
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