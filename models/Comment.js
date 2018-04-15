//Require Mongoose
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
	text: {
		type: String,
		required: true
	},
	image: { type: Schema.Types.ObjectId, ref: 'Image' }
});

commentSchema.set('timestamps', true);

// Compile model from schema
module.exports = mongoose.model('Comment', commentSchema);
