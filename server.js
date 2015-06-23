// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var filePluginLib = require('mongoose-file');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var request = require('request');
var CronJob = require('cron').CronJob;
var fs = require('fs');
var q = require('q');
var passport = ('passport');
var CoinbaseStrategy = ('passport-coinbase').Strategy;
var util = require('util');
var config = require('environmental').config();
var secret = '20h@0vah%9vhq30744&0204!'; //will be changed once I get env variables working
var apiRoutes = express.Router();

//Schema
var ExchangeRate = require('./models/ExchangeRate');
var BlockChainData = require('./models/BlockChainData');
var User = require('./models/User');

// Express
var app = express();

// Middleware
var file = './tmp/bitcurve.json';
// var filePlugin = filePluginLib.filePlugin;
// var make_upload_to_model = filePluginLib.make_upload_to_model;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
apiRoutes.use(function(req, res, next){ //use to disable feature when not logged in
	var token = req.body.token || req.params.token;
	if (token) {
		jwt.verify(token, secret, function(err, decoded) {      
      		if (err) {
        		return res.json({ success:false, message: 'Failed to authenticate token.' });    
      		} else {
        		req.decoded = decoded;    
        		next();
      		}
    	});
    };
});

// Endpoints
// Gives current exchange rate data
var job = new CronJob ('00 */01 * * * *', function(){
	request('https://api.coindesk.com/v1/bpi/currentprice.json', function (error, response, body) {
  		if (!error && response.statusCode == 200) {
  			var exchangeParse = JSON.parse(body);
    		var newExchangeRate = new ExchangeRate({
    			exchangeRate: exchangeParse.bpi.USD.rate, 
    			date: exchangeParse.time.updated,
    			dateISO: exchangeParse.time.updatedISO
    		});
    		newExchangeRate.save(function(err, res){
    			if (err) return handleError(err);
    		})
  		}
	});
}, true);
job.start(); //sends data from the coindesk api every minute

var blockjob = new CronJob ('00 00 09 * * *', function(){
	request ('https://blockchain.info/stats?format=json', function(error, response, body){
		if(!error && response.statusCode == 200) {
			var blockParse = JSON.parse(body);
			var blockDate = new Date(blockParse.timestamp);
			var blockYear = blockDate.getFullYear();
  			var blockMonth = blockDate.getMonth();
  			var blockDay = blockDate.getDate();
			var newBlockChain = new BlockChainData({
				date: blockDate,
        		month: blockMonth + 1,
        		day: blockDay,
        		year: blockYear,
        		price: blockParse.market_price_usd,
        		totalCirculation: blockParse.totalbc,
        		hashRate: blockParse.hash_rate,
        		totalTransactionFees: blockParse.total_fees_btc,
        		numberBitcoinMined: blockParse.n_btc_mined,
        		numberTx: blockParse.n_tx,
        		numberBlocksMined: blockParse.n_blocks_mined,
        		minutesBetweenBlocks: blockParse.minutes_between_blocks,
        		numberBlocksTotal: blockParse.n_blocks_total,
        		tradeVolumeUSD: blockParse.trade_volume_usd,
        		transactionVolume: blockParse.estimated_transaction_volume_usd,
        		blockSize: blockParse.blocks_size,
        		nextRetarget: blockParse.nextretarget,
        		tradeVolumeBTC: blockParse.trade_volume_btc,
        		estimatedBTCSent: blockParse.estimated_btc_sent,
        		totalBTCSent: blockParse.total_btc_sent,
        		dailyMinersRevenueUSD: blockParse.miners_revenue_usd,
        		dailyMinersRevenueBTC: blockParse.miners_revenus_btc,
        		difficulty: blockParse.difficulty,
			})
			newBlockChain.save(function(err, res){
				if(err) return handleError(err);
			})
		}
	});
}, true);
blockjob.start(); //will add data to database once a day at 9am

//POST registration information
app.post('/api/createAccount', function(req, res){
	var newUser = new User(req.body);
	newUser.password = newUser.generateHash(newUser.password);
	newUser.save(function(err, result){
		if (err) {return res.status(500).send(err);}
    	res.send(result);
	});

});

//login endpoint
app.post('/api/login', function(req, res){
	User.findOne({
		username: req.body.username
	}, function(err, user){
		if (err) throw err;

		if (!user) {
			res.status(401).json({ success: false, message: 'Authentication failed. User or password not found.'});
		} else{
			bcrypt.compare(req.body.password, user.password, function(err, match){
				if (match){
					var token = jwt.sign({userid: user._id, username: user.username}, secret, {
					expiresInMinutes: 1440
					});
					res.status(200).json({
						success: true,
						message: 'Token Success!',
						token: token,
					});
				} else {
					res.status(401).json({ message: 'Authentication failed. User or password not found.'});
				}
			}); 
		};
	});
});

// app.post ('/api/postImage', function(req, res){
// 	fs.writeFile(newImageLocation, data, 'base64', function (err) {
//         if (err) throw err
//         console.log('File saved.')
//     });
// })

//get user endpoint return user object
// app.get ('getDashboard', apiRoutes, function(req, res){

// })

//Get request for the current exchange rate
app.get ('/api/getData', function(req, res){
	ExchangeRate.find(function(err, result){
		if(err) return res.status(500).send(err);
		res.send(result);
	});
});

//Get request for historical data from .json file
app.get ('/api/bitcoinJson', function(req, res){
	fs.readFile(file, 'utf8', function (err, data){
		res.send(data);
	});
});

// Connections
var port = 8081;

var mongoUri = 'mongodb://localhost:27017/bitcurve';

mongoose.connect(mongoUri);
mongoose.connection.once('open', function(err, db) {
	if(!err) {
    	console.log('Connected to MongoDB at ', mongoUri);
  	}  
});

app.listen(port);
