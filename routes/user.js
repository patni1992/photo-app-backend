const router = require("express").Router();
const multer = require("multer");
const userController = require("../controllers/user");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function(req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    cb(null, Date.now() + "." + extension);
  }
});

const upload = multer({ storage: storage });

router
  .route("/")
  .get(userController.read)
  .post(userController.create);

router.route("/login").post(userController.login);

router
  .route("/:userId")
  .patch(upload.any(), userController.updateById)
  .delete(userController.deleteById);

module.exports = router;
