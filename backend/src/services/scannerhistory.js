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

exports.totalScanHistory = async(scannerId, userId) => {
    try {
        const params = { scannerId }
        if (userId) params['userId'] = userId
        return ScannerHistory.countDocuments(params).exec()
    }catch (e) {
        console.log(e);
    }
}

exports.totalScanHistoryByUser = async(scannerId, userId) => {
    try {
        const match = { scannerId }
        if (userId) match['userId'] = userId
        const result = await ScannerHistory.aggregate([
            { $match: match },
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': 'id',
                    'as': 'userLookup'
                }
            },
            {
                $unwind: "$userLookup",
            },
            {
                $group: {
                    _id: { userId: "$userId"},
                    total: { $sum: 1 },
                    userId: { $first: "$userId" },
                    username: { $first: "$userLookup.fullname" }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    userId: 1,
                    username: 1,
                }
            },
        ]).exec();

        return result
    }catch (e) {
        console.log(e);
    }
}

exports.totalPageScan = async(scannerId, userId) => {
    try {
        const match = { scannerId }
        if (userId) match['userId'] = userId
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