const { ObjectId } = require('mongodb');

class MessageStorage {
  saveMessage(message) {}
  findMessagesForUser(userId) {}
}

class InMemoryMessageStorage extends MessageStorage {
  constructor() {
    super()
    this.messages = [];
  }

  saveMessage(message) {
    this.messages.push(message);
  }

  findMessagesForUser(userId) {
    return messages.filter((message) => message.from === userId || message.to === userId)
  }
}

class RedisMessageStorage extends MessageStorage {
  constructor(redisClient) {
    super()
    this.redisClient = redisClient;
  }
  
  async saveMessage(message) {
    const value = JSON.stringify(message);
    await this.redisClient
    .multi()
    .rpush(`messages:${message.from}`, value)
    .rpush(`messages:${message.to}`, value)
    .exec();
  }
  
  async findMessagesForUser(userId) {
    return this.redisClient
    .lrange(`messages:${userId}`, 0, -1)
    .then((results) => {
      return results.map((res) => JSON.parse(res))
    })
  }

}

class MongoDBMessageStorage extends MessageStorage {
  constructor(mongoClient) {
    super()
    this.mongoClient = mongoClient
  }

  async saveMessage(message) {
    return this._saveMessagesToDB(message);
  }

  async findMessagesForUser(userId) {
    return this._findMessagesForUserFromDB(userId);
  }

  async _saveMessagesToDB(message){
    await this.mongoClient.db('socialdb').collection('conversations').insertOne({
      ...message,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  async _findMessagesForUserFromDB (userId){
    return await this.mongoClient.db('socialdb')
    .collection('conversations')
    .find({ $or: [{ from: ObjectId(userId) }, {to: ObjectId(userId) }] })
    .toArray();
  }
}

module.exports = {
  InMemoryMessageStorage,
  RedisMessageStorage,
  MongoDBMessageStorage
}