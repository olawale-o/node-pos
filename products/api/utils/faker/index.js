const { faker } = require("@faker-js/faker");

const createUser = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: "password",
  };
};

const createProduct = () => {
  return {
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    quantity: 1,
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  };
};

const createUsers = faker.helpers.multiple(createUser, { count: 1000 });
const createProducts = faker.helpers.multiple(createProduct, { count: 10 });

module.exports = { createUsers, createProducts };
