const Image = require("../models/Image");
const Comment = require("../models/Comment");

exports.createCommentByImageId = (req, res, next) => {
  Image.findById(req.params.id)
    .select("comments")
    .then(image => {
      if (!image) {
        throw { message: "Item Not Found", status: 400 };
      }
      const comment = new Comment({
        author: req.user.id,
        text: req.body.text,
        image: req.params.id
      });

      image.comments.push(comment);
      return Promise.all([comment.save(), image.save()]);
    })
    .then(image => Comment.findById(image[0]._id).populate("author"))
    .then(comment => res.send(comment))
    .catch(e => next(e));
};

exports.read = (req, res, next) => {
  const queryParams = {};

  if (req.query.userId) {
    queryParams.author = req.query.userId;
  }

  if (req.query.imageId) {
    queryParams.image = req.query.imageId;
  }

  Comment.paginate(queryParams, {
    sort: { createdAt: -1 },
    page: parseInt(1),
    populate: "author",
    limit: parseInt(5)
  })
    .then(comments => {
      res.send(comments);
    })
    .catch(e => next(e));
};

exports.readCommentsByImageId = (req, res, next) => {
  Image.findById(req.params.id)
    .populate("comments")
    .then(image => {
      res.send(image[0].populate("author"));
    })
    .catch(e => next(e));
};

exports.updateById = (req, res, next) => {
  Comment.findById(req.params.id)
    .then(comment => {
      comment.text = req.body.text;
      return comment.save();
    })
    .then(comment => {
      res.send(comment);
    })
    .catch(e => next(e));
};

exports.deleteById = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(e => next(e));
};
