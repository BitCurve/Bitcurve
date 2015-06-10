// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var request = require('request');
var CronJob = require('cron').CronJob;


//Schema
var ExchangeRate = require('./models/ExchangeRate');

// Express
var app = express();

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors()); 

// Endpoints
var job = new CronJob ('00 */01 * * * *', function(){
	request('https://api.coindesk.com/v1/bpi/currentprice.json', function (error, response, body) {
  		if (!error && response.statusCode == 200) {
  			var exchangeParse = JSON.parse(body);
    		var newExchangeRate = new ExchangeRate({
    			exchangeRate: exchangeParse.bpi.USD.rate, 
    			date: exchangeParse.time.updated,
    			dateISO: exchangeParse.time.updatedISO
    		})
    		newExchangeRate.save(function(err, res){
    			if (err) return handleError(err);
    			console.log('rate', res);
    		})
  		}
	});
}, true);
job.start(); //sends data from the api every minute

request('https://api.bitcoinaverage.com/history/USD/per_day_all_time_history.csv', function(error, response, body) {
	if (!error && response.statusCode == 200) {
    	// console.log(body);
  	}
});	

request('https://blockchain.info/charts/$chart-type?format=json', function(error, response, body) {
	if (!error && response.statusCode == 200) {
		// console.log(body);
		// var blockchainParse = JSON.parse(body);
	}
})

app.get 

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