'use strict';
const uuid = require('uuid');
const mongo = require('../models');
const AccountSetting = mongo.db.accountsetting;

exports.insertFromJSON = async (json) => {
    return await AccountSetting.insertMany(json);
}

exports.getAccountSettingFromQuery = async (query, page, limit, sort) => {
    try {
        page = page ? page : 1;
        limit = limit ? limit : 100;
        sort = sort ? sort : 'createdAt';

        const retValue = await AccountSetting.find(query).skip((limit * page) - limit).limit(limit).sort(sort).exec();
        const count = await AccountSetting.countDocuments(query).exec();

        return {retValue, count}
    } catch (e) {
        console.log(e);
    }
}

exports.getAccountSettingFromId = async (id) => {
    try {
        return AccountSetting.findOne({id: id}).exec();
    } catch (e) {
        console.log(e);
    }
}

exports.createAccountSetting = async (data) => {
    // data.id = uuid.v4();

    return AccountSetting(data).save();
}

exports.updateAccountSetting = async (id, data) => {
    try {
        if (data.id) {
            delete data.id
        }

        return AccountSetting.updateOne({id: id}, data).exec();
    } catch (e) {
        console.log(e);
    }
}

exports.deleteAccountSetting = async (id) => {
    try{
        return AccountSetting.deleteOne({ id: id }).exec();
    } catch (e) {
        console.log(e);
    }
}