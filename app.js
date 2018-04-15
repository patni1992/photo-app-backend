const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoDB = 'mongodb://127.0.0.1/my_database';
const Image = require('./models/Image');
const Comment = require('./models/Comment');
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './public/uploads');
	},
	filename: function(req, file, cb) {
		const extension = file.mimetype.split('/')[1];
		cb(null, Date.now() + '.' + extension);
	}
});

const upload = multer({ storage: storage });

app.get('/images', (req, res) => {
	Image.find({})
		.sort({ createdAt: -1 })
		.then((data) => {
			res.send(data);
		})
		.catch(function(err) {
			res.status(500).send(err);
		});
});

app.post('/images', upload.any(), (req, res) => {
	let path = req.files[0].path;
	path = path.split('/');
	path.shift();
	path = path.join('/');

	Image.create({
		description: req.body.description,
		path: path,
		tags: req.body.tags.split(',')
	})
		.then((data) => res.send(data))
		.catch(function(err) {
			res.status(422).send(err.message);
		});
});

app.get('/images/:id', (req, res) => {
	Image.findById(req.params.id).populate('comments').then((data) => res.send(data));
});

app.delete('/images/:id', (req, res) => {
	Image.findOneAndRemove(req.params.id).then((data) => res.send(data));
});

app.post('/images/:id/comments/', (req, res) => {
	let image;
	Image.findById(req.params.id)
		.then((data) => {
			image = data;
			return Comment.create({
				text: req.body.text,
				Image: data
			});
		})
		.then((data) => {
			image.comments.unshift(data);
			image.save();
			res.send(data);
		});
	//	Image.findById(req.params.id).then((data) => res.send(data));
});

app.listen(5000, () => console.log('Example app listening on port 5000!'));
