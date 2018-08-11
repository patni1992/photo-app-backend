const router = require("express").Router();
const uploader = require("../middleware/uploader");
const validateRequest = require("../middleware/validateRequest");
const userSchema = require("../validations/user");
const userController = require("../controllers/user");

router
  .route("/")
  .get(userController.read)
  .post(userController.create);

router.route("/login").post(userController.login);

router.route("/:userId/stats").get(userController.readStats);

router
  .route("/:userId")
  .get(userController.readById)
  .patch(
    uploader.single("image"),
    validateRequest(userSchema.updateById),
    userController.updateById
  )
  .delete(userController.deleteById);

module.exports = router;
