'use strict';
const uuid = require('uuid');
const mongo = require('../models');
const ScannerSetting = mongo.db.scannersetting;

exports.insertFromJSON = async (json) => {
    return await ScannerSetting.insertMany(json);
}

exports.getAllScannerSettings = async () => {
    try {
        return ScannerSetting.find().exec();
    }catch (e) {
        console.log(e);
    }
};

exports.getScannerSettingFromQuery = async (query, page, limit, sort) => {
    try {
        const retValue = await ScannerSetting.find(query).skip((limit*page)-limit).limit(limit).sort(sort).exec();
        const count = await ScannerSetting.countDocuments(query).exec();

        return {retValue,count}
    }catch (e) {
        console.log(e);
    }
}

exports.getScannerSettingFromId = async (id) => {
    try {
        return ScannerSetting.findOne({ id: id }).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.createScannerSetting = async (data) => {

    return ScannerSetting(data).save();
}

exports.updateScannerSetting = async (id, data) => {
    try {
        if (data.id) {delete data.id}

        return ScannerSetting.updateOne({ id: id }, data).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.deleteScannerSetting = async (id) => {
    try {
        return ScannerSetting.deleteOne({ id: id }).exec();
    }catch (e) {
        console.log(e);
    }
}
