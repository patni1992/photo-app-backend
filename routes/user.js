var router = require('express').Router();
var mongoose = require('mongoose');
const User = require('../models/User');
var jwt = require('jsonwebtoken');
var auth = require('../middleware/auth');

router.post('/login', (req, res, next) => {
	User.findOne({
		username: req.body.user.username
	})
		.then((user) => {
			if (!user) {
				return res.status(401).send('Wrong password or username');
			}
			if (user.validPassword(req.body.user.password)) {
				return res.send(user.generateJWT());
			} else {
				return res.status(401).send('Wrong password or username');
			}
		})
		.catch(next);
});

router.post('/', function(req, res, next) {
	var user = new User();
	user.username = req.body.user.username;
	user.email = req.body.user.email;
	user.setPassword(req.body.user.password);

	user
		.save()
		.then(function(user) {
			return res.json({ user });
		})
		.catch(next);
});

module.exports = router;
