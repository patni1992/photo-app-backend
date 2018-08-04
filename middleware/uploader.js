const multer = require("multer");

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

module.exports = multer({ storage: storage });
