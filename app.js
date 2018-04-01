const express = require('express');
const app = express();

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/images', (req, res) =>
	res.send([
		{
			id: '0',
			description: 'beautiful landscape',
			tags: [ 'Valley', 'Summer', 'Paradise', 'Sun' ],
			imageLink:
				'https://image.jimcdn.com/app/cms/image/transf/none/path/sa6549607c78f5c11/image/i4eeacaa2dbf12d6d/version/1490299332/most-beautiful-landscapes-in-europe-lofoten-european-best-destinations-copyright-iakov-kalinin.jpg' +
				'3919321_1443393332_n.jpg'
		},
		{
			id: '1',
			description: 'Aliens???',
			tags: [ 'Night', 'Summer' ],
			imageLink:
				'https://img.purch.com/rc/640x415/aHR0cDovL3d3dy5zcGFjZS5jb20vaW1hZ2VzL2kvMDAwLzA3Mi84NTEvb3JpZ2luYWwvc3BhY2V4LWlyaWRpdW00LWxhdW5jaC10YXJpcS1tYWxpay5qcGc=' +
				'08323785_735653395_n.jpg'
		},
		{
			id: '2',
			description: 'On a vacation!',
			tags: [ 'Sea', 'Summer', 'Swim', 'Holiday' ],
			imageLink:
				'https://fm.cnbc.com/applications/cnbc.com/resources/img/editorial/2017/08/24/104670887-VacationExplainsTHUMBWEB.1910x1000.jpg'
		}
	])
);

app.listen(3000, () => console.log('Example app listening on port 3000!'));
