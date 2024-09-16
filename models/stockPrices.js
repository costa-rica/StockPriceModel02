const mongoose = require('mongoose');

const stockPriceSchema = mongoose.Schema({
    ticker: String,
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
});

const stockPrice = mongoose.model('stockPrices', stockPriceSchema);

module.exports = stockPrice;