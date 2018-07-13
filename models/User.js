var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		lowercase: true,
		unique: true,
		required: [true, "can't be empty"],
		match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
		index: true
	},
	email: {
		type: String,
		lowercase: true,
		unique: true,
		required: [true, "can't be empty"],
		match: [/\S+@\S+\.\S+/, 'is invalid'],
		index: true
	},
	image: String,
	hash: {
		type: String,
		select: false
	},
	salt: {
		type: String,
		select: false
	}
}, {
	timestamps: true,
	usePushEach: true
});

UserSchema.plugin(uniqueValidator, {
	message: 'is already taken.'
});

UserSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
		.toString('hex');
};

UserSchema.methods.validPassword = function (password) {
	var hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
		.toString('hex');
	return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
	return jwt.sign({
			id: this._id,
			username: this.username
		},
		secret
	);
};

module.exports = mongoose.model('User', UserSchema);