const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { makeRelativeUrlAbsolute } = require("../helpers/path");
const secret = require("../config").secret;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be empty"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be empty"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    country: {
      type: String
    },
    biography: {
      type: String
    },
    profileImage: {
      type: String,
      default: "/img/kitten.jpg"
    },
    hash: {
      type: String,
      select: false
    },
    salt: {
      type: String,
      select: false
    },
    __v: { type: Number, select: false }
  },
  {
    timestamps: true,
    usePushEach: true,
    toObject: { virtuals: true },
    id: false
  }
);

UserSchema.plugin(uniqueValidator, {
  message: "is already taken."
});

UserSchema.virtual("fullPathProfileImage").get(function() {
  return makeRelativeUrlAbsolute(this.profileImage);
});

UserSchema.pre("remove", function(next) {
  const Image = mongoose.model("Image");
  const Comment = mongoose.model("Comment");

  Promise.all([
    Image.remove({ author: this._id }),
    Comment.remove({ author: this._id })
  ]).then(() => next());
});

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.validPassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  return jwt.sign(
    {
      id: this._id,
      username: this.username
    },
    secret
  );
};

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", UserSchema);
