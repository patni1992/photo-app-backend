const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const mongoDB = 'mongodb://127.0.0.1/my_database';
const Image = require('./models/Image');
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

const app = express();

app.use(bodyParser.json());

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/images', (req, res) => {
	Image.find({})
		.then((data) => {
			res.send(data);
		})
		.catch(function(err) {
			res.status(500).send(err);
		});
});

app.post('/images', (req, res) => {
	res.send();
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));
