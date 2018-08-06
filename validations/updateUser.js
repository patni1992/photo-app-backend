const Joi = require("joi");

const schema = Joi.object().keys({
  email: Joi.string().email(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  country: Joi.string(),
  biography: Joi.string()
});

module.exports = schema;
