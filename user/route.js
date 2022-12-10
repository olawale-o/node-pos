const { env: { LOCAL_MONGODB_SINGLESET } } = require('./constants');
const router = require('express').Router();
const { ObjectID } = require('bson');
const { MongoClient } = require('mongodb');

const client = new MongoClient(LOCAL_MONGODB_SINGLESET);

const User = client.db('socialdb').collection('users');

router.post('/', async (req, res, next) => {
  const { name, username } = req.body;
  console.log(name)
  try {
    const newUser = { name, username, createdAt: new Date(), updatedAt: new Date(), };
    const userId = await User.insertOne(newUser);
    return res.status(200).json({
      ...newUser,
      id: userId,
    })
  } catch (error) {
    console.log(error);
  }  
});
module.exports = router;
