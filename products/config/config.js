module.exports = {
  development: {
    username: "root",
    password: null,
    database: "microservices",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: "root",
    password: null,
    database: "microservices_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "microservices_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
