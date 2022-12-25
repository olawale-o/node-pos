const userRepository = require('../repository/user-repository');
const publisher = require('../events/publisher');

module.exports = {
  register: async (crendentials) => await userRepository.create(crendentials),
  login: async (credentials) => {
    const user = this._verifyUserName(credentials);
    if (this._verifyPassword({ password: user.password, passwordEncrypt: 'encrypt' })) {
      throw new Error("Password invalid")
    }
    return user;
  },
  myRequests: async (crendentials) => {

  },
  _verifyUserName: async (crendentials) => await userRepository.findByUsername(crendentials),
  _verifyPassword: async ({ password, passwordEncrypt }) => password === passwordEncrypt,
  subscribeEvents: async (payload) => {
    const { event, data } = payload;
    switch (event) {
      case 'TEST':
        console.log('it is working', data);
        break;
      default:
        break;
    }
  },
  getConnectionPayload: ({ requester, recipient }, event) => {
    const payload = {
      event,
      data: { requester, recipient }
    };
    return payload;
  },

  getPendingConnectionPayload: ({ userId }, event) => {
    const payload = {
      event,
      data: { userId }
    };
    return payload;
  }
}