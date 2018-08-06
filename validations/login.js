//TODO: Remove Validator validation replace with joi

const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLogin(data) {
  let errors = {};

  for (const [key, value] of Object.entries(data)) {
    data[key] = !isEmpty(data[key]) ? data[key] : "";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
