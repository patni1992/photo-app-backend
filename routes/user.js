const router = require("express").Router();
const uploader = require("../middleware/uploader");
const validateBody = require("../middleware/validateBody");
const updateUserSchema = require("../validations/updateUser");
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
    validateBody(updateUserSchema),
    userController.updateById
  )
  .delete(userController.deleteById);

module.exports = router;
