const express = require('express');
const router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const Image = require('../models/Image');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

router.get('/', auth.required, (req, res, next) => {
	Comment.find({}).then(comments => {
		res.send(comments);
	});
});

router.patch('/:id', auth.required, (req, res, next) => {
	Comment.findById(req.params.id)
		.then(comment => {
			comment.text = req.body.text;
			return comment.save();
		})
		.then(comment => {
			res.send(comment);
		})
		.catch(e => next(e));
});

router.delete('/:id', auth.required, (req, res, next) => {
	Comment.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end();
		})
		.catch(e => next(e));
});

module.exports = router;
