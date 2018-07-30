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

router.get("/", userController.read);

router.post("/login", userController.login);

router.patch("/:userId", upload.any(), userController.updateById);

router.post("/", userController.create);

router.delete("/:userId", userController.deleteById);

module.exports = router;
