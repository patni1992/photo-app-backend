const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const description = Joi.string().max(120);
const tags = Joi.string()
  .allow("")
  .optional()
  .max(200);
const mongoId = Joi.objectId();

module.exports = {
  readById: {
    params: Joi.object().keys({
      id: mongoId.required()
    })
  },
  create: {
    body: Joi.object().keys({
      description: description.required(),
      tags
    })
  },
  updateById: {
    body: Joi.object().keys({
      description: description.allow("").optional(),
      tags
    })
  }
};
