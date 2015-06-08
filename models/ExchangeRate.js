var mongoose = require("mongoose");

var exchangeSchema = new mongoose.Schema({
	exchangeRate: {type: Number},
	date: {type: Date}
});

module.exports = mongoose.model('ExchangeRate', exchangeSchema);