const Joi = require("joi");
const validateBody = (
  schema,
  options = {
    stripUnknown: true,
    abortEarly: false
  }
) => {
  return (req, res, next) => {
    const result = Joi.validate(req.body, schema, options);

    if (result.error) {
      return res.status(400).json(result.error);
    }

    if (!req.value) {
      req.value = {};
    }

    req.value.body = result.value;

    next();
  };
};

module.exports = validateBody;
