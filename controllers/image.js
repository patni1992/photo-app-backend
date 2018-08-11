const Image = require("../models/Image");
const User = require("../models/User");
const sharp = require("sharp");
const { makeRelativeUrlAbsolute } = require("../helpers/path");

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
    .catch(function(err) {
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
  const { tags, description } = req.validated.body;
  if (!req.file) {
    throw new Error("Image is required");
  }

  User.findById(req.user.id)
    .then(user => {
      if (!user) {
        throw new Error("Invalid user");
      }

      return sharp("./public/uploads/" + req.file.filename)
        .resize(1200, 800)
        .max()
        .toFile("./public/uploads/1" + req.file.filename)
        .then(() =>
          Image.create({
            description: description,
            path: "/uploads/1" + req.file.filename,
            tags: tags.split(","),
            author: req.user.id
          })
        );
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
  const { tags, description } = req.validated.body;
  Image.findById(req.params.id)
    .then(image => {
      if (!image) {
        throw new Error("Image not found");
      }

      const newImage = {
        ...image.toObject(),
        description,
        tags: tags
          .replace(/,(\s+)?$/, "")
          .split(",")
          .filter(val => val)
      };

      if (req.file) {
        newImage.path = "/uploads/" + req.file.filename;
      }

      return image.set(newImage).save();
    })
    .then(image => {
      res.send(image);
    })
    .catch(e => next(e));
};
