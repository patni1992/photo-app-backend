var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			lowercase: true,
			unique: true,
			required: [ true, "can't be empty" ],
			match: [ /^[a-zA-Z0-9]+$/, 'is invalid' ],
			index: true
		},
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: [ true, "can't be empty" ],
			match: [ /\S+@\S+\.\S+/, 'is invalid' ],
			index: true
		},
		image: String,
		hash: String,
		salt: String
	},
	{ timestamps: true, usePushEach: true }
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

mongoose.model('User', UserSchema);