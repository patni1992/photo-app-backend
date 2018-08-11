const router = require("express").Router();
const validateBody = require("../middleware/validateBody");
const createImageSchema = require("../validations/createImage");
const imageController = require("../controllers/image");
const commentController = require("../controllers/comment");
const auth = require("../middleware/auth");
const uploader = require("../middleware/uploader");

router
  .route("/")
  .get(imageController.read)
  .post(
    auth.required,
    uploader.single("image"),
    validateBody(createImageSchema),
    imageController.create
  );

router
  .route("/:id")
  .get(imageController.readById)
  .delete(auth.required, imageController.deleteById)
  .patch(auth.required, uploader.single("image"), imageController.updateById);

router
  .route("/:id/comments")
  .get(auth.required, commentController.readCommentsByImageId)
  .post(auth.required, commentController.createCommentByImageId);

module.exports = router;
