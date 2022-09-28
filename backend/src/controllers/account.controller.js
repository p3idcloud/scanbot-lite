'use strict';
// Service
const accountService = require('../services/account');
const { createBucket, putObject, presignedGetObject } = require('../lib/minio.lib');

exports.getAccountFromId = async ( req, res ) => {
    const id = req.params.id;
    const account = await accountService.getAccountFromId(id);

    if (!account) {
        return res.status(400).send(`Couldn't find account`);
    } else {
        return res.status(200).send(account);
    }
}

exports.getAccountFromQuery = async (req, res) => {
    let query = {};
    const account = await accountService.getAccountFromId(req.query.id);

    if (req.query.id) {
        query.id = { '$eq': req.query.id };
    }

    if (req.query.name) {
        query.name = { '$eq': req.query.name };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'createdAt';

    const qValues = await accountService.getAccountFromQuery(query, page, limit, sort)
    let result = {
        data: qValues.retValue,
        dataCount: qValues.count,
        currentPage: page,
        pages: Math.ceil(qValues.count/limit),
        query: query
    }

    return res.send(result);
}

exports.createAccount = async (req, res) => {
    let query = {}
    query.name = { '$eq': req.body.name };

    let account = await accountService.createAccount({
        id: req.body.id,
        username: req.body.username,
        email: req.body.email,
        fullname: req.body.fullname
    });
    
    if (account) {
        return res.status(200).send(account);
    } else {
        return res.status(500).send('Failed to create account.');
    }

}

exports.updateAccount = async (req, res) => {
    const accountId = req.twain.principalId;

    if (accountId) {
        const account = await accountService.updateAccount(req.params.id, req.body);

        return res.status(200).send(account);
    }
    return res.status(401).send('Can not access this feature. You need to login first!');
}

exports.uploadProfilePic = async (req, res) => {
    const account = await accountService.getAccountFromId(req.twain.principalId)
    if (!account) {
        return res.status(400).send("Couldn't find account")
    }

    const id = uuid.v4();

    const bucket = await createBucket(account.id);
    if (bucket != true) {
        return res.status(500).send(bucket);
    }

    const uri = `profile/${id}/${req.file.originalname}`
    const object = await putObject(account.id, uri, req.file, req.file.originalname)
    if (object != true) {
        return res.status(500).send(object)
    }

    const result = await accountService.updateAccount(account.id, {
        profPicURI: uri
    })

    if (result.n > 0){
        const url = await presignedGetObject(account.id, uri);
        const returnobj = {url}
        res.send(returnobj)
    }
}

exports.getProfilePic = async (req, res) => {
    const account = await accountService.getAccountFromId(req.twain.principalId)
    if (!account) {
        return res.status(400).send("Couldn't find account")
    }

    try{
        var url = await presignedGetObject(account.id, account.profPicURI);
    }catch(e){
        return res.status(500).send(e)
    }
    const returnobj = {url}
    return res.send(returnobj)
}


exports.deleteAccount = async (req, res) => {
    const userId = req.twain.principalId;

    if (userId) {
        const account = await accountService.deleteAccount(req.params.id);

        return res.status(200).send(account);
    }

    return res.status(401).send('Can not access this feature. You need to login first!');
}