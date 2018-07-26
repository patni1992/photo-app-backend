const router = require("express").Router();
const { filePath } = require("../config");
const multer = require("multer");
const Image = require("../models/Image");
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }

    cb(null, "./public/uploads");
  },
  filename: function(req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    cb(null, Date.now() + "." + extension);
  }
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  const queryParams = {};
  let page = 1;
  let limit = 7;

  if (req.query.userId) {
    queryParams.author = req.query.userId;
  }

  if (req.query.page) {
    page = req.query.page;
  }

  if (req.query.limit) {
    limit = parseInt(req.query.limit) < 30 ? req.query.limit : limit;
  }

  if (req.query.search) {
    queryParams.$text = { $search: req.query.search };
  }

  Image.paginate(queryParams, {
    sort: { createdAt: -1 },
    populate: "author",
    page: parseInt(page),
    limit: parseInt(limit)
  })
    .then(data => {
      // check if url is absolute
      var r = new RegExp("^(?:[a-z]+:)?//", "i");
      data.docs.forEach(element => {
        if (!r.test(element.path)) {
          element.path = filePath + element.path;
        }
      });
      res.send(data);
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

router.post("/", auth.required, upload.single("image"), (req, res) => {
  let path = req.file.path.replace(/\\/g, "/");
  path = path.split("/");
  path.shift();
  path = path.join("/");

  Image.create({
    description: req.body.description,
    path: path,
    tags: req.body.tags.split(","),
    author: req.user.id
  })
    .then(data => Image.findById(data._id).populate("author"))
    .then(data => {
      var r = new RegExp("^(?:[a-z]+:)?//", "i");
      if (!r.test(data.path)) {
        data.path = filePath + data.path;
      }
      res.send(data);
    })
    .catch(function(err) {
      res.status(422).send(err.message);
    });
});

router.get("/:id", (req, res) => {
  Image.findById(req.params.id)
    .populate("author")
    .populate({
      path: "comments",
      options: { sort: { created_at: -1 } },
      populate: {
        path: "author",
        model: "User"
      }
    })
    .then(data => {
      var r = new RegExp("^(?:[a-z]+:)?//", "i");

      if (!r.test(data.path)) {
        data.path = filePath + data.path;
      }
      res.send(data);
    });
});

router.delete("/:id", auth.required, (req, res) => {
  Image.findByIdAndRemove(req.params.id).then(data => res.send(data));
});

router.patch("/:id", auth.required, upload.any(), (req, res, next) => {
  Image.findById(req.body.id)
    .then(image => {
      if (req.body.description) {
        image.description = req.body.description;
      }

      if (req.body.tags) {
        image.tags = req.body.tags;
      }

      if (req.files.length > 0) {
        let path = req.files[0].path;
        path = path.split("/");
        path.shift();
        path = path.join("/");
        image.path = path;
      }

      if (req.body.tags.length > 0) {
        image.tags = req.body.tags.split(",");
      }

      return image.save();
    })
    .then(image => {
      res.send(image);
    })
    .catch(e => next(e));
});

router.post("/:id/comments", auth.required, (req, res, next) => {
  Image.findById(req.params.id)
    .select("comments")
    .then(image => {
      if (!image) {
        throw { message: "Item Not Found", status: 400 };
      }
      const comment = new Comment({
        author: req.user.id,
        text: req.body.text,
        image: req.params.id
      });

      image.comments.push(comment);
      return Promise.all([comment.save(), image.save()]);
    })
    .then(image => Comment.findById(image[0]._id).populate("author"))
    .then(comment => res.send(comment))
    .catch(e => next(e));
  //	Image.findById(req.params.id).then((data) => res.send(data));
});

router.get("/:id/comments", auth.required, (req, res, next) => {
  Image.findById(req.params.id)
    .populate("comments")
    .then(image => {
      res.send(image[0].populate("author"));
    })
    .catch(e => next(e));
  //	Image.findById(req.params.id).then((data) => res.send(data));
});

module.exports = router;
