'use strict';

const apiKeysService = require('../services/apikeys');
const accountService = require('../services/account');
const crypto = require('crypto');
const ROLE_CONST = require("../constants/role");

exports.createApiKeys = async (req, res) => {
    const user = await accountService.getAccountFromId(req.body.userId);
    if (!user) {
        return res.status(400).send(`Couldn't find user`);
    }

    const apiKeys = await apiKeysService.createApiKeys({
        userId: user.id,
        accountId: user.accountId,
        key: crypto.randomBytes(24).toString('hex'),
        secret: crypto.randomBytes(36).toString('hex'),
        name: req.body.name,
    });

    return res.json(apiKeys);
}

exports.updateApiKeyFromId = async (req, res) => {
    let apiObj = JSON.parse(JSON.stringify(req.body))
    const updateApiId = apiObj.id

    if (apiObj.id) {delete apiObj.id}
    if (apiObj._id) {delete apiObj._id}

    const result = await apiKeysService.updateApiKeyFromId(updateApiId, apiObj)
    if (result.n > 0){
        const newResult = await apiKeysService.getApiFromID(updateApiId)
        return res.send(newResult)
    }

    return res.send(result)
}

exports.deleteApiKey = async (req, res) => {
    const apiKeyId = req.params.apiKeyId
    const deletedApiKey = await apiKeysService.deleteApiKey(apiKeyId)

    return res.send(deletedApiKey) 
}

exports.getApiKeysFromQuery = async (req, res) => {
    const user = await accountService.getUserFromUserID(req.twain.principalId);
    if (!user) {
        return res.status(400).send("Couldn't find user")
    }

    //scope account &/ userid
    let query = {};
    if ( !( user.role.includes(ROLE_CONST.SYSTEMADMIN)) ) {
        if ( user.role.includes(ROLE_CONST.WORKFLOWADMIN) || user.role.includes(ROLE_CONST.ACCOUNTADMIN) ) {
            query.accountId = {'$eq' : user.accountId};
            if (req.query.userId){
                query.userId = {'$eq' : req.query.userId}
            }
        }else {
            query.userId = {'$eq' : user.id}
        }
    } else {
        if (req.query.accountId) {
            query.accountId = {'$eq' : req.query.accountId}
        }
        if (req.query.userId){
            query.userId = {'$eq' : req.query.userId}
        }
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "createdAt";
    let qValues = await apiKeysService.getApiKeysFromQuery(query, page, limit, sort)
    let result = {
        data: qValues.retValue,
        dataCount: qValues.count,
        currentPage: page,
        pages: Math.ceil(qValues.count/limit),
        query: query
    };

    return res.send(result);
}