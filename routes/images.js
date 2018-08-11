const router = require("express").Router();
const validateRequest = require("../middleware/validateRequest");
const imageSchema = require("../validations/image");
const imageController = require("../controllers/image");
const commentController = require("../controllers/comment");
const auth = require("../middleware/auth");
const uploader = require("../middleware/uploader");

router
  .route("/")
  .get(validateRequest(imageSchema.read), imageController.read)
  .post(
    auth.required,
    uploader.single("image"),
    validateRequest(imageSchema.create),
    imageController.create
  );

router
  .route("/:id")
  .get(validateRequest(imageSchema.readById), imageController.readById)
  .delete(auth.required, imageController.deleteById)
  .patch(
    auth.required,
    validateRequest(imageSchema.updateById),
    uploader.single("image"),
    imageController.updateById
  );

router
  .route("/:id/comments")
  .get(auth.required, commentController.readCommentsByImageId)
  .post(auth.required, commentController.createCommentByImageId);

module.exports = router;
