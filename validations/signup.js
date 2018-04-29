const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");
module.exports.validate = [
  (check("email")
    .isEmail()
    .withMessage("must be an email")
    .isLength({ max: 200 })
    .withMessage("Max length for email is 200 chars")
    .trim()
    .normalizeEmail(),
  check("username")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars long")
    .isLength({ max: 200 })
    .withMessage("Max length for email is 200 chars")
    .trim(),
  check("password")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars long")
    .isLength({ max: 200 })
    .withMessage("Max length for password is 200 chars")
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    })).trim()
];
