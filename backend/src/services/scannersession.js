const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const mongo = require('../models');
const scannerSessionService = mongo.db.scannersession;


exports.getScannerSessionFromId = async (id) => {
    try {
        const scannerSession = await scannerSessionService.findOne({"id":id}).exec();
        return scannerSession
    }catch (e) {
        console.log(e);
    }
}

exports.createScannerSession = async (data) => {
    const result = await scannerSessionService(data).save()
    return result
}

exports.updateScannerSessionFromId = async (id, scannerSessionData) => {
    try {
        const retValue = await scannerSessionService.updateOne({"id":id}, scannerSessionData).exec();
        return retValue
    }catch (e) {
        console.log(e);
    }
}