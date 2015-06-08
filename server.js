// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var request = require('request');

// Express
var app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Endpoints
request('https://api.coindesk.com/v1/bpi/currentprice.json', function (error, response, body) {
  	if (!error && response.statusCode == 200) {
    	console.log(body)
  	}
}); //requests data from the coindesk api, data shows up in terminal when you run node server

// Connections
var port = 8081

var mongoUri = 'mongodb://localhost:27017/bitcurve';

mongoose.connect(mongoUri);
mongoose.connection.once('open', function(err, db) {
	if(!err) {
    	console.log('Connected to MongoDB at ', mongoUri);
  	}  
});

app.listen(port);