const { env: { LOCAL_MONGODB_SINGLESET } } = require('./constants');

module.exports = function(socket) {
  const router = require('express').Router();
  const { ObjectID } = require('bson');
  const { MongoClient } = require('mongodb');
  
  const client = new MongoClient(LOCAL_MONGODB_SINGLESET);
  
  const Friend = client.db('socialdb').collection('friends');
  router.post('/', async (req, res, next) => {
    const { requester, recipient } = req.body;
    try {
      const newFriend = {
        users: [requester, recipient],
        status: 'request',
        request: {
          from: requester,
          to: recipient,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const userId = await Friend.insertOne(newFriend);
      return res.status(200).json({
        ...newFriend,
        id: userId,
      })
    } catch (error) {
      console.log(error);
    }  
  });
  return router;
};
