const jwt = require('jsonwebtoken');
const userService = require('./user-service');

const signToken = (credentials, secretKey, expiresIn) => new Promise((resolve, reject) => {
  const { userId } = credentials;
  const options = {
    expiresIn,
    // issuer: 'http://localhost:5000',
    // audience: userId,
  };
  jwt.sign({ userId }, secretKey, options, (err, token) => {
    if (err) {
      reject({ isError: true, message: 'Invalid operation!' });
    } else {
      resolve(token)
    }
  });
});

const verifyToken = (token, secretKey,) => new Promise((resolve, reject) => {
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      reject({ isError: true, message: 'Invalid operation!' });
    } else {
      resolve(decoded)
    }
  });
});

const newAccessToken = async (credentials) => {
  return await signToken(credentials, 'ACCESS_TOKEN_SECRET', '1h');
};

const newfreshToken = async (credentials) => {
  return await signToken(credentials, 'REFRESH_TOKEN_SECRET', 1000 * 60 * 60 * 24);
};

module.exports = {
  reIssueRefreshToken: async (token) => {
    const payload = await verifyRefreshToken(token);
    const userId = payload.aud;
    const user = await userService.getToken({ id: userId });
    if (!user) {
      throw {isError: true, message: 'User token does not exist'};
    }
    const userToken = user.refreshToken;
    if (userToken !== token) {
      throw {isError: true, message: 'Old token. Not valid anymore.'}
    }
    const [accessToken, refreshToken] = await Promise.all([newAccessToken(userId), newfreshToken(userId)]);
  
    await userService.updateToken(user._id, {$set : { refreshToken }});
  
    return { accessToken, refreshToken, };
  },
  signAccessToken: async (credentials) => {
    return await signToken(credentials, 'ACCESS_TOKEN_SECRET', '1h');
  },
  signRefreshToken: async (credentials) => {
    return await signToken(credentials, 'REFRESH_TOKEN_SECRET', 1000 * 60 * 60 * 24);
  },
  verifyAccessToken: async (credentials) => {
    return await verifyToken(credentials, 'ACCESS_TOKEN_SECRET');
  },
  verifyRefreshToken: async (credentials) => {
    return await verifyToken(credentials, 'REFRESH_TOKEN_SECRET');
  }
};
