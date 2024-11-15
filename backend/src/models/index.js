'use strict';

const mongoose = require('mongoose');
const uuid = require("uuid");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;

db.account = require('./account.model');
db.scanner = require('./scanner.model');
db.job = require('./job.model');
db.queue = require('./queue.model');
db.scannersetting = require('./scannersetting.model');
db.scannersession = require('./scannersession.model');
db.scannerstate = require('./scannerstate.model');
db.scannerhistory = require('./scannerhistory.model');
db.scannerdefault = require('./scannerdefault.model');
db.plugin = require('./plugin.model');
db.opentext = require('./opentext.model');

exports.connectDB = async () => {
    const connection = process.env.MONGODB_URL;
    try {
        console.log('---------------------------database connection')
        console.log(connection);
        await db.mongoose.connect(connection,{ });

    } catch (err) {
        console.log('error: ' + err);
        throw err;
    }
};

exports.db = db;
