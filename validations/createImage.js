const Joi = require("joi");

const schema = Joi.object().keys({
  description: Joi.string()
    .max(120)
    .required(),
  tags: Joi.string()
    .allow("")
    .optional()
    .max(10)
});

module.exports = schema;
