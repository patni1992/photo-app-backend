const router = require("express").Router();
const multer = require("multer");
const validateSignup = require("../validations/signup");
const validateLogin = require("../validations/login");
const User = require("../models/User");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function(req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    cb(null, Date.now() + "." + extension);
  }
});

const upload = multer({ storage: storage });

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
});

router.get("/", (req, res, next) => {
  User.find({})
    .then(user => res.send(user))
    .catch(next);
});

router.patch("/:userId", upload.any(), (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      if (req.files.length > 0) {
        let path = req.files[0].path;
        path = path.split("/");
        path.shift();
        path = path.join("/");
        user.profileImage = path;
      }

      user
        .save()
        .then(user => {
          res.send(user);
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
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

router.delete("/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      return user.remove();
    })
    .then(res.sendStatus(200))
    .catch(e => next(e));
});

module.exports = router;
