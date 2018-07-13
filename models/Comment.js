//Require Mongoose
var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

var Schema = mongoose.Schema;

var commentSchema = new Schema({
  text: {
    type: String,
    required: [true, "Text is required"]
  },
  image: { type: Schema.Types.ObjectId, ref: "Image" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

commentSchema.set("timestamps", true);
commentSchema.plugin(mongoosePaginate);

// Compile model from schema
module.exports = mongoose.model("Comment", commentSchema);
