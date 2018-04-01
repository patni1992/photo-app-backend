//Require Mongoose
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ImageSchema = new Schema({
	data: { data: Buffer, contentType: String },
	description: String,
	tags: [ String ]
});

ImageSchema.set('timestamps', true);

// Compile model from schema
module.exports = mongoose.model('Image', ImageSchema);
