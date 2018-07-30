const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/comment");
const auth = require("../middleware/auth");

router.route("/").get(auth.required, commentController.read);

router
  .route("/:id")
  .patch(auth.required, commentController.updateById)
  .delete(auth.required, commentController.deleteById);

module.exports = router;
