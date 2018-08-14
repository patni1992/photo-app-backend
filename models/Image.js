//Require Mongoose
const mongoose = require("mongoose");
const { makeRelativeUrlAbsolute } = require("../helpers/path");
const mongoosePaginate = require("mongoose-paginate");
const { Schema } = mongoose;

const ImageSchema = new Schema(
  {
    path: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 120
    },
    tags: [
      {
        type: String,
        maxlength: 15
      }
    ],
    comments: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
        }
      ],
      select: false
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    __v: { type: Number, select: false },
    createdAt: { type: Date },
    updatedAt: { type: Date, select: false }
  },
  {
    toObject: { virtuals: true },
    id: false
  }
);

ImageSchema.virtual("fullPath").get(function() {
  return makeRelativeUrlAbsolute(this.path);
});

ImageSchema.post("remove", function(next) {
  this.model("Comment").deleteMany(
    {
      image: this._id
    },
    next
  );
});

ImageSchema.set("timestamps", true);
ImageSchema.plugin(mongoosePaginate);
ImageSchema.index({
  description: "text",
  tags: "text"
});

module.exports = mongoose.model("Image", ImageSchema);
