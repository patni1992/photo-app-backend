const router = require("express").Router();
const multer = require("multer");
const imageController = require("../controllers/image");
const commentController = require("../controllers/comment");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }

    cb(null, "public/uploads");
  },
  filename: function(req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    cb(null, Date.now() + "." + extension);
  }
});

const upload = multer({ storage: storage });

router
  .route("/")
  .get(imageController.read)
  .post(auth.required, upload.single("image"), imageController.create);

router
  .route("/:id")
  .get(imageController.readById)
  .delete(auth.required, imageController.deleteById)
  .patch(auth.required, upload.single("image"), imageController.updateById);

router
  .route("/:id/comments")
  .get(auth.required, commentController.readCommentsByImageId)
  .post(auth.required, commentController.createCommentByImageId);

module.exports = router;
