const  env = require('./constants');
const { PORT } = env;

const app = require('./config/app');
const { MongoClient } = require('mongodb');

const dbConnection = require('./database/connection');

dbConnection(MongoClient)
.then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err)
})

app.listen(PORT || 5002, () => {
  console.log('Server started on port 5002');
});

module.exports = app; 