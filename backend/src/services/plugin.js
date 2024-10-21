'use strict'
const mongo = require('../models');
const Plugin = mongo.db.plugin;
const uuid = require('uuid');

exports.insertFromJSON = async (jsonPlugin) => {
    return await Plugin.insertMany(jsonPlugin);
}

exports.getPluginFromId = async (id) => {
    try {
        return Plugin.findOne({ id: id }).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.getPluginFromName = async (name, accountID) => {
    try {
        return Plugin.findOne({ name: name, accountID: accountID }).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.updatePlugin = async (name, accountID, data) => {
    try {
        if (data.id) {delete data.id}
        const plugin = await Plugin.findOneAndUpdate({ name: name, accountID: accountID }, data, {upsert: true}).exec();
        return plugin;
    }catch (e) {
        console.log(e);
    }
}

exports.deletePlugin = async (id) => {
    return Plugin.deleteOne({ id: id });
}

exports.getPlugin = async (data) => {
    return Plugin.findOne(data);
}