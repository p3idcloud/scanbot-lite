'use strict';
const uuid = require('uuid');
const mongo = require('../models');
const scannerState = mongo.db.scannerstate;
const scanner = mongo.db.scanner;

exports.insertFromJSON = async (json) => {
    return await scannerState.insertMany(json);
}

exports.getScannerStateFromQuery = async (query, page, limit, sort) => {
    try {
        const retValue = await scannerState.find(query).skip((limit*page)-limit).limit(limit).sort(sort).exec()
        const count = await scannerState.countDocuments(query).exec()

        return {retValue,count}
    }catch (e) {
        console.log(e);
    }
}

exports.getScannerStateFromScannerId = async (scannerId) => {
    try {
        return await scannerState.findOne({ scannerId: scannerId }).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.createScannerState = async (data) => {
    data.id = uuid.v4();

    return await scannerState(data).save();
}

exports.updateScannerState = async (scannerId, data) => {
    try {
        return await scannerState.updateOne({ scannerId: scannerId }, data, {new: true}).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.pushInsertImageURI = async (scannerId, imageUrl) => {
    try{
        return await scannerState.findOneAndUpdate(
            { scannerId: scannerId },
            { $push: {imageUrl: imageUrl} },
            {new:true}
        ).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.deleteScannerState = async (id) => {
    try {
        return await scannerState.deleteOne({ id: id }).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.resetScannerState = async (scannerId) => {
    let scannerStateData = {};
    scannerStateData.status = 'Connecting';
    scannerStateData.currentQueueId = '';
    scannerStateData.currentlyUsedByUserId = '';
    scannerStateData.sessionId = '';
    scannerStateData.imageUrl = [];
    scannerStateData.latestEvent = 'Connecting to cloud service';
    scannerStateData.state = 'noSession';
    scannerStateData.lastCommandAt = null;
    try {
        return await scannerState.updateOne({ scannerId: scannerId }, scannerStateData, {new: true}).exec();

    }catch (e) {
        console.log(e);
    }
}

exports.countScannerStateByStatus = async (isOffline, accountId) => {
    let match = {}

    if (isOffline) {
        match['status'] = 'offline';
    } else {
        match['status'] = { $not: /^offline.*/ };
    }

    match['scannerLookup.accountId'] = accountId

    try {
        const result = await scannerState.aggregate([
            {
                '$lookup': {
                    'from': 'scanners',
                    'localField': 'scannerId',
                    'foreignField': 'id',
                    'as': 'scannerLookup'
                }
            },
            {
                $unwind: "$scannerLookup",
            },
            { $match : match },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1
                }
            },
        ]).exec()

        return result
    }catch (e) {
        console.log(e);
    }
}