const { env: { LOCAL_MONGODB_SINGLESET } } = require('../constants');

module.exports = async function(client) {
  return client.connect(LOCAL_MONGODB_SINGLESET)
  .then((client) => {
    const db = client.db("socialdb");
    return 'done';
  });
};