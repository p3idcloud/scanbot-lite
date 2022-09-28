'use strict';
const mongoose = require('mongoose');

const ScannerSessionSchema = new mongoose.Schema({
    id: String,
    scannerId: String,
    state: String,
    revision: Number,
    doneCapturing: Boolean,
    imageBlocksDrained: Boolean,
    status: String,
    paperIn: Boolean,
    imageBlocks: [Number]
}, { timestamps: true });

const ScannerSession = mongoose.model('ScannerSession', ScannerSessionSchema);

ScannerSession.collection.createIndex({
    id: 'text'
});

module.exports = ScannerSession;