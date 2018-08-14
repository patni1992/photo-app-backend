const sharp = require("sharp");
const validateLogin = require("../validations/login");
const validateSignup = require("../validations/signup");
const User = require("../models/User");
const Image = require("../models/Image");
const Comment = require("../models/Comment");

exports.read = (req, res, next) => {
  User.find({})
    .then(user => {
      if (!user) next(new Error("No user found"));
      return res.send(user);
    })
    .catch(next);
};

exports.create = (req, res, next) => {
  const user = new User();
  const { errors, isValid } = validateSignup(req.body);

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
};

exports.login = (req, res, next) => {
  let dataObj = Object.assign(
    {
      password: "",
      username: ""
    },
    req.body
  );
  const { errors, isValid } = validateLogin(dataObj);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.username }]
  })
    .select("hash salt username email profileImage")
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
};

exports.updateById = (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      user.set(req.validated.body);
      if (req.file) {
        user.profileImage = "/uploads/" + "thumb-" + req.file.filename;

        return sharp("./public/uploads/" + req.file.filename)
          .resize(100, 100)
          .toFile("./public/uploads/" + "thumb-" + req.file.filename)
          .then(data => user.save())
          .then(user => res.send(user))
          .catch(e => next(e));
      }

      user
        .save()
        .then(user => res.send(user))
        .catch(e => next(e));
    })
    .catch(e => next(e));
};

exports.readStats = (req, res, next) => {
  Promise.all([
    Image.countDocuments({
      author: req.params.userId
    }),
    Comment.countDocuments({
      author: req.params.userId
    })
  ])
    .then(function(values) {
      res.send({
        imageCount: values[0],
        commentCount: values[1]
      });
    })
    .catch(e => next(e));
};

exports.readById = (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => res.send(user))
    .catch(e => next(e));
};

exports.deleteById = (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      return user.remove();
    })
    .then(res.sendStatus(200))
    .catch(e => next(e));
};
