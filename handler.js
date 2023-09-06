const { LOCAL_MONGODB_SINGLESET } = require('./config');
const { ObjectID } = require('bson');
const { MongoClient } = require('mongodb');

const client = new MongoClient(LOCAL_MONGODB_SINGLESET);

const User = client.db('socialdb').collection('users');
const Follower = client.db('socialdb').collection('followers');
const Following = client.db('socialdb').collection('following');


const register = async (req, res, next) => {
  const { name, username } = req.body;
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
}

const login = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    return res.status(200).json({
      user,
    })
  } catch (error) {
    console.log(error);
  }
};

const followers = async (req, res, next) => {
  const { id } = req.params;
  try {
    const followers = await Follower.aggregate([
      { $match: { followeeId: ObjectID(id) } },
      {
        $lookup: {
          from: "users",
          localField: "followerId",
          foreignField: "_id",
          as: "connection"
        }
      },
      { $unwind: { path: "$connection" } },
    ]).toArray();
    return res.status(200).json({
      followers,
    })
  } catch (error) {
    console.log(error);
  }
};

const following = async (req, res, next) => {
  const { id } = req.params;
  try {
    const following = await Following.aggregate([
      { $match: { followerId: ObjectID(id) } },
      {
        $lookup: {
          from: "users",
          localField: "followeeId",
          foreignField: "_id",
          as: "connection"
        }
      },
      { $unwind: { path: "$connection" } },
    ]).toArray();
    return res.status(200).json({
      following,
    })
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
  followers,
  following
}