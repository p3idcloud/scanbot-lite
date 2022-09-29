'use strict';
const uuid = require('uuid');
const express = require('express');
const router = express.Router({ mergeParams: true });
const fs = require('fs');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { putObject, presignedGetObject } = require('../lib/minio.lib')
const {getScannerStateFromScannerId, updateScannerState} = require("../services/scannerstate");
const accountService = require("../services/account");
const {getQueueFromId} = require("../services/queue");
const {getJobFromId, updateJob} = require("../services/job");

const logger = require('../utils/logger')('api-blocks');

const getFileId = function(req, blockId) {
    const accountId = req.twain.principalId;
    const scannerId = req.params.scannerId;

    return `${accountId}/scannedDocuments/${scannerId}/${blockId}`;
};

exports.blockGet = async (req, res) => {
    const blockuri = req.query.blockUri;
    const user = await accountService.getAccountFromId(req.twain.principalId);

    try{
        var url = await presignedGetObject(user.id, blockuri);
    }catch(e){
        return res.status(500).send(e)
    }
    const returnobj = {url}
    return res.send(returnobj)
};