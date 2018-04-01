const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ storage: storage });
const mongoDB = 'mongodb://127.0.0.1/my_database';
const Image = require('./models/Image');
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

app.use(bodyParser.json());

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads');
	},
	filename: function(req, file, cb) {
		const extension = file.mimetype.split('/')[1];
		cb(null, Date.now() + '.' + extension);
	}
});

app.get('/images', (req, res) => {
	Image.find({})
		.then((data) => {
			res.send(data);
		})
		.catch(function(err) {
			res.status(500).send(err);
		});
});

app.post('/images', upload.any(), (req, res) => {
	console.log(req.files);
	console.log(req.body);
	return res.send();
});
app.listen(1337, () => console.log('Example app listening on port 1337!'));
