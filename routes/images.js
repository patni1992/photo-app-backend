const router = require("express").Router();
const validateRequest = require("../middleware/validateRequest");
const imageSchema = require("../validations/image");
const imageController = require("../controllers/image");
const commentController = require("../controllers/comment");
const auth = require("../middleware/auth");
const uploader = require("../middleware/uploader");

router
  .route("/")
   /**
   * @api {get} /images Get images
   * @apiGroup Images
   * @apiParam {String} [userId]    id of author
   * @apiParam {String} [search]    search on description & tags
   * @apiParam {Number} [page]      page number
   * @apiParam {Number} [limit]     results to be returned, default 7 max 30
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
  {
    "docs": [
        {
            "tags": [
                "placeat",
                "et",
                "accusamus",
                "magnam"
            ],
            "_id": "5b73613c3fded24683752882",
            "path": "https://images.unsplash.com/photo-1533681852052-dba7a3e4ef81?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjMxMzUyfQ&s=9ef62050472908fb031545bc4a87073d",
            "description": "Laboriosam sapiente ut reiciendis placeat id aspernatur doloribus cupiditate sunt.",
            "author": {
                "profileImage": "/uploads/kitten.jpg",
                "_id": "5b73613b3fded246837524a0",
                "username": "golda27",
                "email": "ezekiel.stroman44@yahoo.com",
                "createdAt": "2018-08-14T23:09:48.757Z",
                "fullPathProfileImage": "http://localhost:5000/uploads/kitten.jpg"
            },
            "createdAt": "2018-08-14T23:09:48.682Z",
            "fullPath": "https://images.unsplash.com/photo-1533681852052-dba7a3e4ef81?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjMxMzUyfQ&s=9ef62050472908fb031545bc4a87073d"
        },
        {
            "tags": [
                "voluptates",
                "quis",
                "fuga",
                "dolor",
                "rerum"
            ],
            "_id": "5b73613c3fded24683752883",
            "path": "https://images.unsplash.com/photo-1533875885304-c5eaeadc5923?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjMxMzUyfQ&s=03c33c354147cc728b07eeb4e791a46d",
            "description": "Dolorem delectus possimus in error dolor voluptas magnam omnis occaecati.",
            "author": {
                "profileImage": "/uploads/kitten.jpg",
                "_id": "5b73613b3fded246837524a1",
                "username": "emelie49",
                "email": "abel.schneider@gmail.com",
                "createdAt": "2018-08-14T23:09:48.757Z",
                "fullPathProfileImage": "http://localhost:5000/uploads/kitten.jpg"
            },
            "createdAt": "2018-08-14T23:09:48.682Z",
            "fullPath": "https://images.unsplash.com/photo-1533875885304-c5eaeadc5923?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjMxMzUyfQ&s=03c33c354147cc728b07eeb4e791a46d"
        }
    ],
    "total": 1000,
    "limit": 2,
    "page": 1,
    "pages": 500
}
   */
  .get(validateRequest(imageSchema.read), imageController.read)

  /**
   * @api {post} /images Create Image
   * @apiGroup Images
   * @apiParam {String} description   description of the image.
   * @apiParam {String} [tags]        tags related to the image, seperate with comma.
   * @apiParam {File} [image]         image file
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   {
    "tags": [
        "footbal",
        " ynwa",
        " liverpool"
    ],
    "_id": "5b749b794edebc3f0430b16c",
    "description": "Best football team in the world!",
    "path": "/uploads/11534368633148.jpeg",
    "author": {
        "profileImage": "/uploads/kitten.jpg",
        "_id": "5b73613b3fded246837524a2",
        "username": "kenyon26",
        "email": "lorenza88@hotmail.com",
        "createdAt": "2018-08-14T23:09:48.757Z",
        "fullPathProfileImage": "http://localhost:5000/uploads/kitten.jpg"
    },
    "createdAt": "2018-08-15T21:30:33.312Z",
    "fullPath": "http://localhost:5000/uploads/11534368633148.jpeg"
}

   */
  .post(
    auth.required,
    uploader.single("image"),
    validateRequest(imageSchema.create),
    imageController.create
  );

router
  .route("/:id")
   /**
   * @api {get} /images/:id Get image by id
   * @apiGroup Images
   * @apiParam {String} id  id of image
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
  {
    "tags": [
        "Fast",
        " 458",
        " red"
    ],
    "comments": [],
    "_id": "5c251e7d4ac2cf07ea813b50",
    "description": "Ferrari",
    "path": "/uploads/11545936509575.jpeg",
    "author": {
        "profileImage": "/img/kitten.jpg",
        "_id": "5c0791ea6271dd122a5a823d",
        "username": "testman",
        "email": "test@hotmail.com",
        "createdAt": "2018-12-05T08:52:58.549Z",
        "updatedAt": "2018-12-05T08:52:58.549Z",
        "fullPathProfileImage": "http://localhost:5000/img/kitten.jpg"
    },
    "createdAt": "2018-12-27T18:48:29.630Z",
    "fullPath": "http://localhost:5000/uploads/11545936509575.jpeg"
 }
   */
  .get(validateRequest(imageSchema.readById), imageController.readById)
  .delete(auth.required, imageController.deleteById)
  .patch(
    auth.required,
    validateRequest(imageSchema.updateById),
    uploader.single("image"),
    imageController.updateById
  );

router
  .route("/:id/comments")
  .get(auth.required, commentController.readCommentsByImageId)
  .post(auth.required, commentController.createCommentByImageId);

module.exports = router;
