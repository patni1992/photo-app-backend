const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const description = Joi.string().max(120);
const tags = Joi.string()
  .allow("")
  .optional()
  .max(200);
const mongoId = Joi.objectId();

module.exports = {
  read: {
    query: Joi.object().keys({
      author: Joi.objectId().max(50),
      search: Joi.string().max(100),
      page: Joi.number()
        .integer()
        .greater(0)
        .default(1),
      limit: Joi.number()
        .integer()
        .min(1)
        .max(30)
        .default(7)
    })
  },
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
