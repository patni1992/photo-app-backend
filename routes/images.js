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

router.get("/", imageController.read);

router.get("/:id", imageController.readById);

router.post("/", auth.required, upload.single("image"), imageController.create);

router.delete("/:id", auth.required, imageController.deleteById);

router.patch(
  "/:id",
  auth.required,
  upload.single("image"),
  imageController.updateById
);

router.post(
  "/:id/comments",
  auth.required,
  commentController.createCommentByImageId
);

router.get(
  "/:id/comments",
  auth.required,
  commentController.readCommentsByImageId
);

module.exports = router;
