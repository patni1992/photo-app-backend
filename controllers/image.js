const Image = require("../models/Image");
const User = require("../models/User");
const sharp = require("sharp");
const {
  makeRelativeUrlAbsolute
} = require("../helpers/path");

exports.read = (req, res, next) => {
  const queryParams = {};
  let page = 1;
  let limit = 7;

  if (req.query.userId) {
    queryParams.author = req.query.userId;
  }

  if (req.query.page) {
    page = req.query.page;
  }

  if (req.query.limit) {
    limit = parseInt(req.query.limit) < 30 ? req.query.limit : limit;
  }

  if (req.query.search) {
    queryParams.$text = {
      $search: req.query.search
    };
  }

  Image.paginate(queryParams, {
      sort: {
        createdAt: -1
      },
      populate: "author",
      page: parseInt(page),
      limit: parseInt(limit)
    })
    .then(images => {
      images.docs.forEach(image => {
        image.path = makeRelativeUrlAbsolute(image.path);
      });

      res.send(images);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
};

exports.readById = (req, res, next) => {
  Image.findById(req.params.id)
    .populate("author")
    .populate({
      path: "comments",
      options: {
        sort: {
          created_at: -1
        }
      },
      populate: {
        path: "author",
        model: "User"
      }
    })
    .then(data => res.send(data));
};

exports.create = (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      if (!user) {
        throw new Error("Invalid user");
      }
      let tags = "";
      if (req.body.tags) {
        tags = req.body.tags;
      }
      let filename = null;

      filename = "/uploads/" + req.file.filename;
      return sharp("./public/uploads/" + req.file.filename)
        .resize(1200, 800)
        .max()
        .toFile("./public/uploads/1" + req.file.filename)
        .then(() => Image.create({
          description: req.body.description,
          path: "/uploads/1" + req.file.filename,
          tags: tags.split(","),
          author: req.user.id
        }))

    })
    .then(data => Image.findById(data._id).populate("author"))
    .then(data => res.send(data))
    .catch(e => {
      next(e);
    });
};
exports.deleteById = (req, res, next) => {
  Image.findByIdAndRemove(req.params.id).then(data => res.send(data));
};

exports.updateById = (req, res, next) => {
  Image.findById(req.body.id)
    .then(image => {
      if (!image) {
        throw new Error("Image not found");
      }
      if (req.body.description) {
        image.description = req.body.description;
      }

      if (req.body.tags) {
        image.tags = req.body.tags;
      }

      if (req.file) {
        image.path = "/uploads/" + req.file.filename;
      }

      if (req.body.tags.length > 0) {
        image.tags = req.body.tags.split(",");
      }

      return image.save();
    })
    .then(image => {
      res.send(image);
    })
    .catch(e => next(e));
};