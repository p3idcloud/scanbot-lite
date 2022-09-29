'use strict';
const uuid = require('uuid');
const mongo = require('../models');
const ScannerHistory = mongo.db.scannerhistory;

exports.insertFromJSON = async (json) => {
    return await ScannerHistory.insertMany(json);
}

exports.getScannerHistoryFromQuery = async (query, page, limit, sort) => {
    try {
        const retValue = await ScannerHistory.find(query).skip((limit*page)-limit).limit(limit).sort(sort).exec();
        const count = await ScannerHistory.countDocuments(query).exec();

        return {retValue,count}
    }catch (e) {
        console.log(e);
    }
}

exports.getScannerHistoryFromId = async (id) => {
    try {
        return ScannerHistory.findOne({ id: id }).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.createScannerHistory = async (data) => {
    data.id = uuid.v4();

    return ScannerHistory(data).save();
}

exports.incrementPageCount = async (queueId) => {
    try{
        return await ScannerHistory.findOneAndUpdate(
            { queueId: queueId },
            { $inc: {pageCount: 1} },
            {new:true}
        ).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.updateScannerHistory = async ( queueId, data) => {
    try {
        if (data.id) {delete data.id}

        return ScannerHistory.updateOne({ queueId: queueId }, data).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.deleteScannerHistory = async (id) => {
    try {
        return ScannerHistory.deleteOne({ id: id }).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.totalScanHistory = async(scannerId, accountId) => {
    try {
        const params = { scannerId }
        if (accountId) params['accountId'] = accountId
        return ScannerHistory.countDocuments(params).exec()
    }catch (e) {
        console.log(e);
    }
}

exports.totalPageScan = async(scannerId, accountId) => {
    try {
        const match = { scannerId }
        if (accountId) match['accountId'] = accountId
        const result = await ScannerHistory.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { scannerId: "$scannerId"},
                    total: { $sum: "$pageCount" },
                    scannerId: { $first: "$scannerId" }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    scannerId: 1
                }
            },
            { $limit: 1 },
        ]).exec();

        return result
    }catch (e) {
        console.log(e);
    }
}