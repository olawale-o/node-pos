const Joi = require('joi');

const userValidationSchema = Joi.object({
  username: Joi.string()
    .required(),
  name: Joi.string()
    .required(),
  password: Joi.string()
    .required()
}).with('username', 'password');

module.exports = userValidationSchema;
