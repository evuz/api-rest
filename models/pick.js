'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PickSchema = Schema({
    author: String,
    date: Date,
    publicDate: { type: Date, default: Date.now() },
    "sport": String,
    "competition": String,
    "match": String,
    "pick": String,
    "tipster": String,
    "stake": Number,
    "odd": Number,
    "result": { type: String, enum: ['W', 'V', 'L'] },
    "bookie": String,
});

module.exports = mongoose.model('Pick', PickSchema);