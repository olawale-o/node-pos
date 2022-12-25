const tokenService = require('../services/token-serviceService');
const userService = require('../services/user-service');

async function checkIfAllowed(userId) {
  const user = await userService.getToken({ id: userId });
  if (!user) {
    throw {isError: true, message: 'User does not exist'};
  }
  if (user?.accessToken) {
    throw {isError: true, message: 'User token does not exist'};
  }
}

module.exports = verifyAccessToken = async (req, res, next) => {
  try {
    const authToken =  req.headers?.authorization;
    if (!authToken) {
      throw {isError : true, message : "No auth token provided!"};
    }
    const accessToken = authToken.split(' ')[1];
    const payload = await tokenService.verifyAccessToken(accessToken);
    await checkIfAllowed(payload.aud);
     // 1. If the last sent refresh token to user is in logged out state in database.
     // 2. If the last sent refresh token to user is in blocked state in database.
  } catch (error) {
    next(err);
  }
};