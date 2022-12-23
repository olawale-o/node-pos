const userService = require('./services/user-service');

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
      const user = await userService.verifyUserName({ username });
      await userService.verifyPassword(password, 'encrypt');
      return res.status(201).json(user);  
    } catch (error) {
      console.log(error);
    }
  }
}