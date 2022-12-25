const Joi = require('joi');
const AppError = require('../common/app-error');
const httpStatus = require('../common/http-status');

const validateNewUserBody = (schema) => (req, res, next) => {
  const { value, error } = Joi.compile(schema).validate(req.body);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ');

    return next(new AppError(
      httpStatus.BAD_REQUEST.code,
      errorMessage,
    ));
  }

  Object.assign(req, value);
  return next();
};

module.exports = validateNewUserBody;
