const router = require("express").Router();
const mongoose = require("mongoose");
const validateSignup = require("../validations/signup");
const validateLogin = require("../validations/login");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/login", (req, res, next) => {
  var user = new User();
  let dataObj = Object.assign(
    {
      password: "",
      username: ""
    },
    req.body
  );
  const { errors, isValid } = validateLogin(dataObj);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.username }]
  })
    .select("hash salt username email")
    .then(user => {
      if (!user) {
        return res.status(401).send({ password: "Wrong password or username" });
      }
      if (user.validPassword(req.body.password)) {
        return res.send("Bearer " + user.generateJWT());
      } else {
        return res.status(401).send("Wrong password or username");
      }
    })
    .catch(next);
});

router.get("/", (req, res, next) => {
  User.find({})
    .then(user => res.send(user))
    .catch(next);
});

router.post("/", function(req, res, next) {
  var user = new User();

  const { errors, isValid } = validateSignup(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user
    .save()
    .then(function(user) {
      return res.json({
        user
      });
    })
    .catch(next);
});

module.exports = router;
