//Require Mongoose
var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

var Schema = mongoose.Schema;

var ImageSchema = new Schema({
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
  this.model("Comment")
    .deleteMany({ image: this._id })
    .then(data => {
      next();
    });
});

ImageSchema.set("timestamps", true);
ImageSchema.plugin(mongoosePaginate);
ImageSchema.index({ description: "text" });

// Compile model from schema
module.exports = mongoose.model("Image", ImageSchema);
