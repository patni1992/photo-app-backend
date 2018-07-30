//Require Mongoose
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const { Schema } = mongoose;

const ImageSchema = new Schema({
  path: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: [String],
  comments: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    select: false
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

ImageSchema.post("remove", function(next) {
  this.model("Comment").deleteMany({ image: this._id }, next);
});

ImageSchema.set("timestamps", true);
ImageSchema.plugin(mongoosePaginate);
ImageSchema.index({ description: "text" });

module.exports = mongoose.model("Image", ImageSchema);
