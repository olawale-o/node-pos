const { env: { LOCAL_MONGODB_SINGLESET } } = require('../constants');
const { ObjectID } = require('bson');
const { MongoClient } = require('mongodb');

const client = new MongoClient(LOCAL_MONGODB_SINGLESET);
const Friend = client.db('microservice').collection('connections');
const ConnectionRequest = client.db('microservice').collection('requests');

module.exports = {
  create: async (credentials) => await Friend.insertOne(credentials),
  createMany: async (credentials) => await Friend.insertMany(credentials),
  findOneAndUpdate: async (credentials) => {
    const { requester, recipient } = credentials;
    const request = await ConnectionRequest.findOneAndUpdate(
      { userId: ObjectID(recipient) },
      { 
        $push: {
          requests: { friendId: requester, createdAt: new Date(), updatedAt: new Date() },
          sort: { createdAt: -1 }
        }
      },
      { upsert: true }
    );
    return request;
  },
};
