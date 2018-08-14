const Image = require("../models/Image");
const User = require("../models/User");
const sharp = require("sharp");

module.exports = {
  read: (req, res, next) => {
    const { author, search, page, limit } = req.validated.query;
    const formatedQuery = {};
    const queryParams = { author };

    for (let key in queryParams) {
      if (queryParams[key]) formatedQuery[key] = queryParams[key];
    }

    if (search) {
      formatedQuery.$text = {
        $search: search
      };
    }

    Image.paginate(formatedQuery, {
      sort: {
        createdAt: -1
      },
      populate: "author",
      page: parseInt(page),
      limit: parseInt(limit)
    })
      .then(images => res.send(images))
      .catch(function(err) {
        res.status(500).send(err);
      });
  },

  readById: (req, res, next) => {
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
      .then(image => res.send(image));
  },

  create: (req, res, next) => {
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
      .then(image => res.send(image))
      .catch(e => {
        next(e);
      });
  },

  deleteById: (req, res, next) => {
    Image.findByIdAndRemove(req.params.id).then(data => res.send(data));
  },

  updateById: (req, res, next) => {
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
  }
};
