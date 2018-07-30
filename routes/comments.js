const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/comment");
const auth = require("../middleware/auth");

router.get("/", auth.required, commentController.read);

router.patch("/:id", auth.required, commentController.updateById);

router.delete("/:id", auth.required, commentController.deleteById);

module.exports = router;
