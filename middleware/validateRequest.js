const validateRequest = requestSchema => (req, res, next) => {
  const Joi = require("joi");
  const validations = ["headers", "params", "query", "body"].map(key => {
    const schema = requestSchema[key];
    const value = req[key];
    const validate = () =>
      schema
        ? Joi.validate(value, schema, {
            stripUnknown: true,
            abortEarly: false
          })
        : Promise.resolve({});
    return validate().then(result => ({ [key]: result }));
  });
  return Promise.all(validations)
    .then(result => {
      req.validated = Object.assign({}, ...result);
      next();
    })
    .catch(validationError => {
      next(validationError);
      //   const message = validationError.details.map(d => d.message);
      //   res.status(400).send(validationError);
    });
};

module.exports = validateRequest;
