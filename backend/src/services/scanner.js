'use strict';
const mongo = require('../models')
const Scanner = mongo.db.scanner
const iot = require('../utils/iotClient')

exports.insertFromJSON = async (jsonScanner) => {
    const scanners = await Scanner.insertMany(jsonScanner)
    return scanners
}

exports.getScannersFromQuery = async (query, page, limit, sort) => { //SWR standart
    try {
        const retValue = await Scanner.find(query).skip((limit*page)-limit).limit(limit).sort(sort).exec();
        const count = await Scanner.countDocuments(query).exec();
        
        return {retValue,count}
    }catch (e) {
        console.log(e);
    }
}

exports.createScanner = async (scannerData) => {
    const result = await Scanner(scannerData).save()
    
    return result
}

exports.getScannerFromId = async (scannerId) => {
    try {
        const retValue = await Scanner.findOne({"id":scannerId}).exec();

        return retValue
    }catch (e) {
        console.log(e);
    }
}

exports.getScannerFromAccountId = async (accountId) => {
    try {
        const retValue = await Scanner.findOne({"accountId":accountId}).exec();

        return retValue
    }catch (e) {
        console.log(e);
    }
}

exports.getScannerFromLoginToken = async (loginToken) => {
    try {
        const retValue = await Scanner.findOne({"loginToken":loginToken}).exec();

        return retValue
    }catch (e) {
        console.log(e);
    }

}

exports.deleteScannerFromId = async (scannerId) => {
    try {
        const retValue = await Scanner.deleteOne({"id":scannerId}).exec();

        return retValue
    }catch (e) {
        console.log(e);
    }
}

exports.updateScannerFromId = async (scannerId, scannerObj) => {
    try {
        if (scannerObj.id) {delete scannerObj.id}
        if (scannerObj.accountId) {delete scannerObj.accountId}

        const retValue = await Scanner.updateOne({"id":scannerId}, scannerObj).exec();

        return retValue
    }catch (e) {
        console.log(e);
    }
}

exports.getScannerDeviceSessionFromId = async (scannerId) => {
    try {
        const retValue = await Scanner.findOne({"id":scannerId}).exec();
        const iotUrl = await iot.signMqttUrl()

        const deviceSession = {
            type: 'mqtt',
            url: iotUrl,
            requestTopic: iot.getDeviceRequestTopic(scannerId),
            responseTopic: iot.getDeviceResponseTopic(retValue.accountId)
        };

        return deviceSession
    }catch (e) {
        console.log(e);
    }
}

exports.getScannerFromToken = async (token) => {
    try {
        const retValue = await Scanner.findOne({"registrationToken":token}).exec();

        return retValue
    }catch (e) {
        console.log(e);
    }
}

exports.countScanners = async (accountId) => {
    const condition = {}
    condition.accountId = accountId
    const result = Scanner.countDocuments(condition);
    return result
}

exports.countScannerByManufacturer = async (accountId) => {
    try {
        let match = {}
        match['accountId'] = accountId

        const result = await Scanner.aggregate([
            { $match : match },
            {
                $group: {
                    _id: { manufacturer: "$manufacturer"},
                    total: { $sum: 1 },
                    manufacturer: { $first: "$manufacturer" }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    manufacturer: 1
                }
            }
        ]).exec();

        return result
    }catch (e) {
        console.log(e);
    }
}