const connectionRepository = require('../repository/connection-repository');

const myRequests = (credentials) => {
  console.log('got credentials', credentials);
  return credentials;
};

module.exports = {
  friendRequest: async (credentials) => {
    return await connectionRepository.findOneAndUpdate(credentials)
  },
  subscribeEvents: async (payload) => {
    console.log("------");
    console.log(payload);
    const { event, data } = payload;
    switch (event) {
      case 'GET_PENDING_REQUEST':
        await myRequests(data)
        break;
      case 'TEST':
        console.log('it is working', data);
        break;
      default:
        break;
    }
  }
};

