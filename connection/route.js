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
      const newUser = {
        users: [requester, recipient],
        status: 'request',
        request: {
          from: requester.id,
          to: recipient.id,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const userId = await Friend.insertOne(newUser);
      return res.status(200).json({
        ...newUser,
        id: userId,
      })
    } catch (error) {
      console.log(error);
    }  
  });
  return router;
};
