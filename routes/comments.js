const express = require("express");
const router = express.Router({ mergeParams: true });
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

router.get("/", auth.required, (req, res, next) => {
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
});

router.patch("/:id", auth.required, (req, res, next) => {
  Comment.findById(req.params.id)
    .then(comment => {
      comment.text = req.body.text;
      return comment.save();
    })
    .then(comment => {
      res.send(comment);
    })
    .catch(e => next(e));
});

router.delete("/:id", auth.required, (req, res, next) => {
  Comment.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(e => next(e));
});

module.exports = router;
