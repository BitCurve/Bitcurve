var mongoose = require("mongoose");

var blockChainSchema = new mongoose.Schema({
	date: {type: String},
	month: {type: Number},
    day: {type: Number},
    year: {type: Number},
    price: {type: Number},
    totalCirculation: {type: Number},
    hashRate: {type: Number},
    totalTransactionFees: {type: Number},
    numberBitcoinMined: {type: Number},
    numberTx: {type: Number},
    numberBlocksMined: {type: Number},
    minutesBetweenBlocks: {type: Number},
    numberBlocksTotal: {type: Number},
    tradeVolumeUSD: {type: Number},
    transactionVolume: {type: Number},
    blockSize: {type: Number},
    nextRetarget: {type: Number},
    tradeVolumeBTC: {type: Number},
    estimatedBTCSent: {type: Number},
    totalBTCSent: {type: Number},
    dailyMinersRevenueUSD: {type: Number},
    dailyMinersRevenueBTC: {type: Number},
    difficulty: {type: Number},
});

module.exports = mongoose.model('BlockChainData', blockChainSchema);