const Joi = require("joi");

const email = Joi.string()
  .email()
  .max(120);
const firstName = Joi.string().max(60);
const lastName = Joi.string().max(60);
const country = Joi.string().max(100);
const biography = Joi.string().max(300);

module.exports = {
  updateById: {
    body: Joi.object().keys({
      email,
      firstName: firstName.allow(""),
      lastName: lastName.allow(""),
      country: country.allow(""),
      biography: biography.allow("")
    })
  }
};
