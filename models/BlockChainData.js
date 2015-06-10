var mongoose = require("mongoose");

var blockChainSchema = new mongoose.Schema({
	exchangeRate: {type: Number},
	date: {type: Date},
	dateISO: {type: Date}
});

module.exports = mongoose.model('BlockChainData', blockChainSchema);