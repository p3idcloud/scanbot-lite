'use strict'
const mongo = require('../models');
const Queue = mongo.db.queue;
const uuid = require('uuid');

exports.getQueueFromQuery = async (query, page, limit, sort) => {
    try {
        const retValue = await Queue.find(query).skip((limit*page)-limit).limit(limit).sort(sort).exec();
        const count = await Queue.countDocuments(query).exec();

        return {retValue,count}
    }catch (e) {
        console.log(e);
    }
}

exports.insertFromJSON = async (jsonQueue) => {
    return await Queue.insertMany(jsonQueue);
}

exports.getQueueFromId = async (id) => {
    try {
        return Queue.findOne({ id: id }).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.createQueue = async (data) => {
    if (data.id) {delete data.id}
    
    data.id = uuid.v4();

    return Queue(data).save();
}

exports.updateQueue = async (id, data) => {
    try {
        if (data.id) {delete data.id}
        if (data.accountId) {delete data.accountId}

        return Queue.updateOne({ id: id }, data, {new: true}).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.deleteQueue = async (id) => {
    try {
        return Queue.deleteOne({ id: id }).exec();
    }catch (e) {
        console.log(e);
    }
}
