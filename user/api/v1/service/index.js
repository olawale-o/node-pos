const prisma = require("../../../database");
module.exports = {
  create: async (data) => {
    const user = await prisma.user.create({
      data,
    });
    if (user) {
      return user;
    }

    throw new Error("Unable to create user");
  },
  getUserPayload: async (userId, product, event) => {
    // check userId against db
    if (userId) {
      const payload = {
        event,
        data: { userId, product },
      };
      return payload;
    } else {
      throw new Error("User does not exist");
    }
  },
};
