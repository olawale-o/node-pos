const axios = require('axios');

module.exports.PublishConnectionEvent = async (payload) => {
  console.log('publishing.....', payload);
  return await axios.post('http://localhost:5000/api/connection/v1/app-event', {
    payload,
  });
}