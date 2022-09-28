'use strict';
const mongo = require('../models');
const ApiKeys = mongo.db.apikeys;
const uuid = require('uuid');

exports.createApiKeys = async (data) => {
    if (data.id) {delete data.id}
    data.id = uuid.v4();
    return ApiKeys(data).save();
}

exports.getApiKey = async (data) => {
    return ApiKeys.findOne(data);
}

exports.deleteApiKey = async (id) => {
    return ApiKeys.deleteOne({ id: id }).exec();
}

exports.getApiKeysFromQuery = async (query, page, limit, sort) => {
    try {
        const retValue = await ApiKeys.aggregate([
            { $match: {...query} },
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
        ]).skip((limit*page)-limit).limit(limit).sort(sort).exec();
        const count = await ApiKeys.countDocuments(query).exec();

        return {retValue,count}
    }catch (e) {
        console.log(e);
    }
};

exports.getApiKeysFromQueryWithUserData = async (query, page, limit, sort) => {
    try {
        const result = await ApiKeys.aggregate([
            { $match: {query} },
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
            }
        ]).skip((limit*page)-limit).limit(limit).sort(sort).exec();

        return result
    } catch (e) {
        console.log(e);
    }
}

exports.updateApiKeyFromId = async (id, apiObj) => {
    try {
        let newApiObj = apiObj;
        delete newApiObj._id;

        const retValue = await ApiKeys.updateOne({"id":id}, newApiObj).exec();

        return retValue
    } catch (e) {
        console.log(e);
    }
}

exports.getApiFromID = async (id) => {
    try {
        const apiKeySecret = await ApiKeys.findOne({"id":id}).exec();
        return apiKeySecret
    } catch (e) {
        console.log(e);
    }
}