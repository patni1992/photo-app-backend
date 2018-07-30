const router = require("express").Router();

router.use("/images", require("./images"));
router.use("/comments", require("./comments"));
router.use("/users", require("./user"));

module.exports = router;
