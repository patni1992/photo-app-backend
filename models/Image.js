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
	tags: [ String ],
	comments: {
		type: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } ],
		select: false
	},
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

ImageSchema.set('timestamps', true);

// Compile model from schema
module.exports = mongoose.model('Image', ImageSchema);
