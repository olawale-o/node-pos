const dotenv = require("dotenv");
if (process.env.NODE_ENV !== "production" || process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotenv.config({ path: configFile });
} else {
  dotenv.config();
}
const { PORT, NODE_ENV } = process.env;

module.exports = {
  env: {
    PORT,
    NODE_ENV,
  },
};
