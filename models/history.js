const mongoose = require('mongoose');
const config = require('../config/database');

const Schema = mongoose.Schema;

// History Schema
const HistorySchema = new Schema(
    {
        id: { type: Number, unique: true },
        history: { type: String }
    },
    { collection: 'history' });

const Hist = mongoose.model('Hist', HistorySchema);
module.exports = Hist;

// Get all history from database
module.exports.getAllHistory = function (history, callback) {
    Hist.find(history, callback);
}

// Get history by id
module.exports.getHistoryById = function (id, callback) {
    const query = { id: id };
    Hist.findOne(query, callback);
}

// Add history
module.exports.addHistory = function (newHistory, callback) {
    newHistory.save(newHistory, callback);
}

// Update history
module.exports.updateHistory = function (id, history, bool, callback) {
    const query = { id: id };
    const updObj =  {$set: { history: history }};
    const st = {new: bool, upsert: bool};
    Hist.findOneAndUpdate(query, updObj, st, callback);
}

// Delete history by id
module.exports.deleteHistoryById = function (id, callback) {
    const query = { id: id };
    Hist.remove(query, callback);
}

// Delete all history
module.exports.deleteAllHistory = function (history, callback) {
    Hist.remove(history, callback);
}