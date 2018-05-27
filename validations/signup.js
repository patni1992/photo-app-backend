const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateSignup(data) {
	let errors = {};

	for (const [ key, value ] of Object.entries(data)) {
		data[key] = !isEmpty(data[key]) ? data[key] : '';
	}

	if (!Validator.isEmail(data.email)) {
		errors.email = 'Email is invalid';
	}

	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email field is required';
	}

	if (!Validator.isLength(data.username, { min: 6, max: 30 })) {
		errors.username = 'Username must be at least 6 characters';
	}

	if (Validator.isEmpty(data.username)) {
		errors.username = 'Username field is required';
	}

	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = 'Password must be at least 6 characters';
	}

	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password field is required';
	}

	if (Validator.isEmpty(data.confirmPassword)) {
		errors.confirmPassword = 'Confirm Password field is required';
	}

	if (!Validator.equals(data.password, data.confirmPassword)) {
		errors.confirmPassword = 'Passwords must match';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
