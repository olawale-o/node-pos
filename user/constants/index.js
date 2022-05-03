const dotenv = require('dotenv');
if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'prod') {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotenv.config({ path: configFile });
} else {
  dotenv.config();
}
const { PORT, ACCESS_SECRET, REFRESH_SECRER, NODE_ENV } = process.env;

module.exports = {
  env: {
    PORT,
    ACCESS_SECRET,
    REFRESH_SECRER,
    NODE_ENV,
  },
};
