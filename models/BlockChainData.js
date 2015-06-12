var mongoose = require("mongoose");

var blockChainSchema = new mongoose.Schema({
	Month: {type: Number},
	Day: {type: Number},
    Year: {type: Number},
    Price: {type: Number},
    totalCirculation: {type: Number},
    totalTransactionFees: {type: Number},
    numberOfUniqueBitcoinAddressesUsed: {type: Number},
    totalOutputVolumeValue: {type: Number},
    averageNumberOfTransactionsPerBlock: {type: Number}
});

module.exports = mongoose.model('BlockChainData', blockChainSchema);