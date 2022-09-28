'use strict';
const uuid = require('uuid');
const mongo = require('../models');
const AccountSettingDefinition = mongo.db.accountsettingdefinition;

exports.insertFromJSON = async (json) => {
    return await AccountSettingDefinition.insertMany(json);
}

exports.getAccountSettingDefinitionFromQuery = async (query, page, limit, sort) => {
    try {
        const retValue = await AccountSettingDefinition.find(query).skip((limit*page)-limit).limit(limit).sort(sort).exec();
        const count = await AccountSettingDefinition.countDocuments(query).exec();

        return {retValue,count}
    } catch (e) {
        console.log(e);
    }
}

exports.getAccountSettingDefinitionFromAccountId = async (accountId) => {
    try{
        return AccountSettingDefinition.findOne({ accountId: accountId }).exec();
    } catch (e) {
        console.log(e);
    }
}

exports.createAccountSettingDefinition = async (data) => {
    data.id = uuid.v4();

    return AccountSettingDefinition(data).save();
}

exports.updateAccountSettingDefinition = async (accountId, data) => {
    try{
        if (data.id) {delete data.id}
        return AccountSettingDefinition.updateOne({ accountId: accountId }, data, {upsert:true, new:true}).exec();
    } catch (e) {
        console.log(e);
    }
}

exports.deleteAccountSettingDefinition = async (id) => {
    try{
        return AccountSettingDefinition.deleteOne({ id: id }).exec();
    } catch (e) {
        console.log(e);
    }
}