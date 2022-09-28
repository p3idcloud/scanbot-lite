'use strict';
const db = require('../models');

const jobService = require('../services/job');
const accountService = require("../services/account")
const ROLE_CONST = require("../constants/role")

exports.getJobsFromQuery = async (req, res) => { //SWR standard
    const account = await accountService.getAccountFromId(req.twain.principalId)
    if (!account) {
        return res.status(400).send("Couldn't find account")
    }

    //initial query
    let query = {}

    //scope account &/ accountid
    query.accountId = {'$eq' : account.id};

    //find id
    if (req.query.id) {
        query.id = {'$eq' : req.query.id}
    }

    //having regex with case insensitive search will reduce performance on big entries
    //this will not make efficient use of an index and result in all values being scanned for matches.
    if (req.query.name) {
        query.name = {'$regex' : '.*'+req.query.name+'.*', '$options' : '$i'}
    }

    //find serialno
    if (req.query.serialNo) {
        query.serialNo = {'$eq' : req.query.serialNo}
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const sort = req.query.sort || "createdAt"
    
    const qValues = await jobService.getJobsFromQuery(query, page, limit, sort)
    let result = {
        data: qValues.retValue,
        dataCount: qValues.count,
        currentPage: page,
        pages: Math.ceil(qValues.count/limit),
        query: query
    }
    
    return res.send(result)
}

exports.insertJob = async (req, res) => {
    let job = req.body;

    const account = await accountService.getAccountFromId(req.twain.principalId);
    if (!account) {
        return res.status(400).send("Couldn't find account");
    }

    job.accountId = user.id;

    const result = await jobService.createJob(job);
    return res.send(result);
}

exports.getJobFromId = async (req, res) => {
    const jobId = req.params.jobId

    const account = await accountService.getAccountFromId(req.twain.principalId)
    if (!account) {
        return res.status(400).send("Couldn't find account")
    }

    const job = await jobService.getJobFromId(jobId)
    if (!job) {
        return res.status(400).send("Couldn't find job")
    }

    if (job.accountId != account.id) {
        return res.status(400).send("Job doesn't belong to account")
    }

    return res.send(job)
}

exports.deleteJobFromId = async (req, res) => {
    const jobId = req.params.jobId;

    const account = await accountService.getAccountFromId(req.twain.principalId)
    if (!account) {
        return res.status(400).send("Couldn't find account")
    }

    const job = await jobService.deleteJob(jobId)

    return res.send(job);
}

exports.updateJobFromId = async (req, res) => {
    const jobId = req.params.jobId;
    const updateJob = req.body;

    const account = await accountService.getAccountFromId(req.twain.principalId);
    if (!account) {
        return res.status(400).send("Couldn't find account")
    }

    const job = await jobService.updateJob(jobId,updateJob);

    return res.send(job);
}
