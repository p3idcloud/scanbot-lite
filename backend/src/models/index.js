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
db.profiledefinition = require('./profiledefinition.model');
db.scannersession = require('./scannersession.model');
db.scannerstate = require('./scannerstate.model');
db.scannerhistory = require('./scannerhistory.model');
db.scannerdefault = require('./scannerdefault.model');

exports.connectDB = async () => {
    const connection = process.env.MONGODB_URL;
    try {
        console.log('---------------------------database connection')
        console.log(connection);
        await db.mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true });

    } catch (err) {
        console.log('error: ' + err);
        throw err;
    }
};

exports.db = db;
