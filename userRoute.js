const { LOCAL_MONGODB_SINGLESET } = require('./config');
const router = require('express').Router();
const { ObjectID } = require('bson');
const { MongoClient } = require('mongodb');

const client = new MongoClient(LOCAL_MONGODB_SINGLESET);

const User = client.db('socialdb').collection('users');
const Friend = client.db('socialdb').collection('friends');

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

router.get('/', async (req, res, next) => {
  try {
    const allUsers = await User.find({ username: { $ne: req.query.q } }).toArray();
    return res.status(200).json({
      users: allUsers,
    })
  } catch (error) {
    console.log(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username } = req.body;
    console.log(username)
    const user = await User.findOne({ username });
    return res.status(200).json({
      user,
    })
  } catch (error) {
    console.log(error);
  }
});

router.post('/friends', async (req, res, next) => {
  try {
    const { requester, recipient } = req.body;
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
    const friends = await Friend.insertOne(newFriend);
    return res.status(200).json({
      friends,
    })
  } catch (error) {
    console.log(error);
  }
});

router.post('/friends/accept', async (req, res, next) => {
  try {
    const { request_id } = req.body;

    const doc = await Friend.findOneAndUpdate({ _id: ObjectID(request_id) },  { $set: { status: 'accept' } }, { returnNewDocument: true });
    return res.status(200).json({
      doc,
    })
  } catch (error) {
    console.log(error);
  }
});

router.get('/pending', async (req, res, next) => {
  try {
    const { q } = req.query;
    const friends = await Friend.aggregate([
      { $match: { $and: [ { users: { $in: [ObjectID(q)] } }, {  status: 'request' } ] } },
      {
        $lookup: {
          from: "users",
          localField: "request.to",
          foreignField: "_id",
          as: "recipient"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "request.from",
          foreignField: "_id",
          as: "requester"
        }
      },
      {
        $project: {
          "_id": 1,
          "status": 1,
          "request": 1,
          "recipient": {$first: "$recipient"},
          "requester": {$first: "$requester"},
        }
      }
    ]).toArray();
    return res.status(200).json({
      friends,
    })
  } catch (error) {
    console.log(error);
  }
});

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
    const friends = await Friend.aggregate([
      { $match:  { users: { $in: [ObjectID(q)] } } },
      {
        $project: {
          "users": 1,
          "_id": 0
        }
      },
      {
        $project: {
          users: {
            $filter: {
               input: "$users",
               as: "user",
               cond: { $ne: [ "$$user", ObjectID(q) ] }
            }
         }
        },
      },
      {
        $project: {
          user: { $arrayElemAt: [ "$users", 0 ] },
        }
      }
      // {
      //   $unwind: "$users"
      // },
      // {
      //   $group: {
      //     _id: "$users",
      //   }
      // },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "_id",
      //     foreignField: "_id",
      //     as: "friend_suggestions"
      //   }
      // },
      // {
      //   $project: {
      //     suggestion: { $arrayElemAt: [ "$friend_suggestions", 0 ] },
      //   }
      // },
      // {
      //   $replaceRoot: { newRoot: "$suggestion" }
      // }
    ]).toArray();
    const users = await User.aggregate([
      { $match:  { _id:  { $ne: ObjectID(q) } } },
    ]).toArray();
    const suggestionIds = friends.map((suggestion) => {
      return suggestion.user.toString()
    });
    const suggestions = users.filter((user) => !suggestionIds.includes(user._id.toString()));
    return res.status(200).json({suggestions})

  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
