//Require Mongoose
var mongoose = require('mongoose');

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
	tags: [ String ]
});

ImageSchema.set('timestamps', true);

// Compile model from schema
module.exports = mongoose.model('Image', ImageSchema);