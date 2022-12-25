const { env: { LOCAL_MONGODB_SINGLESET } } = require('../constants');
const { ObjectID } = require('bson');
const { MongoClient } = require('mongodb');

const client = new MongoClient(LOCAL_MONGODB_SINGLESET);
const User = client.db('microservice').collection('users');
module.exports = {
  create: async (credentials) => await User.insertOne(credentials),
  findByUsername: async ({ username }) => await User.findOne({ username }),
  findById: async ({ id }) => await User.findOne({ _id: ObjectID(id) }),
  findByIdAndUpdate: async (id, operation) => await User.findOneAndUpdate({ _id: ObjectID(id) }, operation),
};
