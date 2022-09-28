'use strict'
const mongo = require('../models');
const Account = mongo.db.account;
const uuid = require('uuid');

exports.insertFromJSON = async (jsonAccount) => {
    return await Account.insertMany(jsonAccount);
}

// exports.getAccountFromQuery = async (query, page, limit, sort) => {
//     try {
//         const retValue = await Account.find(query).skip((limit*page)-limit).limit(limit).sort(sort).exec();
//         const count = await Account.countDocuments(query).exec();

//         return {retValue,count}
//     }catch (e) {
//         console.log(e);
//     }
// }

exports.getAccountFromId = async (id) => {
    try {
        return Account.findOne({ id: id }).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.createAccount = async (data) => {
    // if (data.id) {delete data.id}
    
    // data.id = uuid.v4();

    return Account(data).save();
}

exports.updateAccount = async (id, data) => {
    try {
        if (data.id) {delete data.id}
        return Account.updateOne({ id: id }, data).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.deleteAccount = async (id) => {
    return Account.deleteOne({ id: id });
}

exports.getAccount = async (data) => {
    return Account.findOne(data);
}