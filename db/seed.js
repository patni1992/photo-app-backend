
require('dotenv').config({path: '../.env'});
const faker = require("faker");
const mongoose = require("mongoose");
const dummyImages = require("./dummyImages.json");
const User = require("../models/User");
const Image = require("../models/Image");
const Comment = require("../models/Comment");

const users = [];
const images = [];
const comments = [];
const imagesGroupedById = {};

mongoose.Promise = global.Promise;

mongoose.connect(
  process.env.DBURI,
  { useNewUrlParser: true }
);

function generateRandomImages(numbersOfImgsToGenerate = 1000) {
  let image;
  for (let i = 0; i < numbersOfImgsToGenerate; i++) {
    image = new Image();

    image.tags = faker.lorem
      .words(Math.floor(Math.random() * 4) + 3)
      .split(" ");
    image.path = faker.helpers.randomize(dummyImages);
    image.description = faker.lorem.sentence();
    image.author = users[Math.floor(Math.random() * users.length)]._id;
    images.push(image);
    imagesGroupedById[image._id] = image;
  }

  return images;
}

function generateRandomUsers(numbersOfUserToGenerate = 100) {
  let user;
  for (let i = 0; i < numbersOfUserToGenerate; i++) {
    user = new User();
    user.username =
      faker.name.firstName() + (Math.floor(Math.random() * 49) + 1);
    user.email = faker.internet.email();
    user.setPassword("123456");
    users.push(user);
  }

  return users;
}

function generateRandomComments(numbersOfCommentsToGenerate = 5000) {
  let comment;
  let commentsGroupedByImageId = {};
  let startDate;
  for (let i = 0; i < numbersOfCommentsToGenerate; i++) {
    startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);
    comment = new Comment();
    comment.text = faker.lorem.sentence();
    comment.author = users[Math.floor(Math.random() * users.length)]._id;
    comment.image = images[Math.floor(Math.random() * images.length)]._id;
    comment.createdAt = faker.date.between(startDate, new Date());
    comments.push(comment);
  }

  comments.forEach(comment => {
    if (!commentsGroupedByImageId.hasOwnProperty(comment.image)) {
      commentsGroupedByImageId[comment.image] = [];
    }
    commentsGroupedByImageId[comment.image].push(comment);
  });

  Object.keys(commentsGroupedByImageId).forEach(imageId => {
    imagesGroupedById[imageId].comments = commentsGroupedByImageId[imageId];
  });
}

function init(
  imagesToInsert = 500,
  commentsToInsert = 1000,
  usersToInsert = 20
) {
  return new Promise((resolve, reject) => {
    mongoose.connection.on("connected", function() {
      mongoose.connection.db
        .dropDatabase()
        .then(() => {
          generateRandomUsers(usersToInsert);
          generateRandomImages(imagesToInsert);
          generateRandomComments(commentsToInsert);
          return Promise.all([
            User.insertMany(users),
            Image.insertMany(images),
            Comment.insertMany(comments)
          ]);
        })
        .then(data => {
          console.log(
            `Database ${process.env.DBURI} cleared & seed completed \ninserted \n${
              data[1].length
            } images \n${data[2].length} comments \n${data[0].length} users`
          );
          resolve(true);
        })
        .catch(e => reject(e));
    });
  });
}
module.exports = {
  init
};

require("make-runnable");
