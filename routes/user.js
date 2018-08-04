const router = require("express").Router();
const uploader = require("../middleware/uploader");
const userController = require("../controllers/user");

router
  .route("/")
  .get(userController.read)
  .post(userController.create);

router.route("/login").post(userController.login);

router
  .route("/:userId")
  .patch(uploader.single("image"), userController.updateById)
  .delete(userController.deleteById);

module.exports = router;
