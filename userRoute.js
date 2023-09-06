const { LOCAL_MONGODB_SINGLESET } = require('./config');
const router = require('express').Router();
const { ObjectID } = require('bson');
const { MongoClient } = require('mongodb');

const client = new MongoClient(LOCAL_MONGODB_SINGLESET);

const User = client.db('socialdb').collection('users');
const Friend = client.db('socialdb').collection('friends');

const handler = require('./handler');

module.exports = function(IO) {

  router.post('/', handler.register);
  
  router.post('/login', handler.register);
  
  router.post('/friends', async (req, res, next) => {
    try {
      const { requester, recipient, socketId } = req.body;
      const senderSocket = IO.sockets.sockets.get(socketId);
      const newFriend = {
        users: [ObjectID(requester), ObjectID(recipient)],
        status: 'request',
        request: {
          from: ObjectID(requester),
          to: ObjectID(recipient),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const friend = await Friend.insertOne(newFriend);
      return res.status(200).json({
        friend,
      })
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/:id/friends', async (req, res, next) => {
    const { id } = req.params;
    try {
      const users = await User.find({ _id: { $ne: ObjectID(id) } }).toArray();
      return res.status(200).json({
        users,
      })
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/:id/followers', handler.followers);

  router.get('/:id/following', handler.following);
  
  router.get('/suggestion', async (req, res, next) => {
    try {
      const { q } = req.query;
      // const suggestions = await Friend.aggregate([
      //   { $match:  { users: { $nin: [ObjectID(q)] } } },
      //   {
      //     $project: {
      //       "users": 1,
      //       "_id": 0
      //     }
      //   },
      //   {
      //     $unwind: "$users"
      //   },
      //   {
      //     $group: {
      //       _id: "$users",
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "_id",
      //       foreignField: "_id",
      //       as: "friend_suggestions"
      //     }
      //   },
      //   {
      //     $project: {
      //       suggestion: { $arrayElemAt: [ "$friend_suggestions", 0 ] },
      //     }
      //   },
      //   {
      //     $replaceRoot: { newRoot: "$suggestion" }
      //   }
      // ]).toArray();
      // const friends = await Friend.aggregate([
      //   { $match:  { users: { $in: [ObjectID(q)] } } },
      //   {
      //     $project: {
      //       "users": 1,
      //       "_id": 0
      //     }
      //   },
      //   {
      //     $project: {
      //       users: {
      //         $filter: {
      //            input: "$users",
      //            as: "user",
      //            cond: { $ne: [ "$$user", ObjectID(q) ] }
      //         }
      //      }
      //     },
      //   },
      //   {
      //     $project: {
      //       user: { $arrayElemAt: [ "$users", 0 ] },
      //     }
      //   }
      // ]).toArray();
      // const users = await User.aggregate([
      //   { $match:  { _id:  { $ne: ObjectID(q) } } },
      // ]).toArray();
      // const suggestionIds = friends.map((suggestion) => {
      //   return suggestion.user.toString()
      // });
      // const suggestions = users.filter((user) => !suggestionIds.includes(user._id.toString()));
      

      const friends = await Friend.aggregate([
        { $match:  { users: { $in: [ObjectID(q)] } } },
        {
          $project: {
            "users": 1,
            "request": 1,
            "_id": 0
          }
        },
      ]).toArray();
      const users = await User.aggregate([
        { $match:  { _id:  { $ne: ObjectID(q) } } },
      ]).toArray();
      const suggestions = friends.map((suggestion) => suggestion.user.toString());
      return res.status(200).json({friends})
  
    } catch (error) {
      console.log(error);
    }
  });

  return router;
}


