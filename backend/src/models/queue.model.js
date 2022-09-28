'use strict';
const mongoose = require("mongoose");

const QueueSchema = new mongoose.Schema({
        id: String,
        jobId: String,
        scannerId: String,
        accountId: String,
        imageDirURI: String,
        startDate: Date,
        scanStartDate: Date,
        scanEndDate: Date,
        imageProcStartDate: Date,
        imageProcEndDate: Date,
        releaseStartDate: Date,     // ?
        releaseEndDate: Date,       // ?
        lastModifiedDate: Date,
        scannerName: String,
        serialNo: String,           // This is linked to Scanner table (scannerID)
        model: String,              // ^^
        macAddress: String,         // ^^
        ipAddress: String,          // ^^
        imageStatus: Number,
        status: String,
        isConfirmed: Number,
        description: String,
        retryCount: Number,
        threadGUID: String,         //?
        webSocketURL: String,       //havent found out what is this for , probably all the websockets to get the status of scanner?
        webSocketToken: String,     //^^
        scanPageNumber: Number        
}, { timestamps: true })

const Queue = mongoose.model(
    "Queue", QueueSchema
)

Queue.collection.createIndex(
    {
            id: "text",
            scannerId: "text"
    }
)

module.exports = Queue;