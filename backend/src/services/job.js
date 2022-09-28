'use strict'
const mongo = require('../models');
const job = mongo.db.job;
const uuid = require('uuid');

exports.getJobsFromQuery = async (query, page, limit, sort) => {
    try {
        const retValue = await job.find(query).skip((limit*page)-limit).limit(limit).sort(sort).exec();
        const count = await job.countDocuments(query).exec();

        return {retValue,count}
    }catch (e) {
        console.log(e);
    }
}

exports.insertFromJSON = async (jsonJob) => {
    const retValue = await job.insertMany(jsonJob);
    return retValue
}

exports.pushInsertImageURI = async (jobId, imageUri) => {
    try{
        return await job.findOneAndUpdate(
            { id: jobId },
            { $push: {imageURI: imageUri}, $inc: {pageCount: 1} },
            {new:true}
        ).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.getJobFromId = async (id) => {
    try {
        const retValue = await job.findOne({ id: id }).exec();
        return retValue
    }catch (e) {
        console.log(e);
    }
}

exports.createJob = async (data) => {
    return job(data).save();
}

exports.updateJob = async (id, data) => {
    try {
        if (data.id) {delete data.id}
        if (data.accountId) {delete data.accountId}

        return job.updateOne({ id: id }, data, {new: true}).exec();
    }catch (e) {
        console.log(e);
    }
}

exports.deleteJob = async (id) => {
    try {
        return job.deleteOne({ id: id }).exec();
    }catch (e) {
        console.log(e);
    }
}
