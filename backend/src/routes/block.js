'use strict';
const express = require('express');
const uuid = require('uuid');
const block = require('../controllers/blocks.controller');
const router = express.Router({ mergeParams: true });

const { createBucket, putObjectBuffer, presignedGetObject } = require('../lib/minio.lib')
const {getScannerStateFromScannerId, pushInsertImageURI} = require("../services/scannerstate");
const accountService = require("../services/account");
const {getQueueFromId} = require("../services/queue");
const {getJobFromId, updateJob} = require("../services/job");
const ScannerHistory = require('../services/scannerhistory');
const jobService = require("../services/job");

const logger = require('../utils/logger')('api-blocks');

const getFileId = function(req, blockId) {
    const accountId = req.twain.principalId;
    const scannerId = req.params.scannerId;

    return `${accountId}/scannedDocuments/${scannerId}/${blockId}`;
};

const getFileIdFromArguments = function (accountId, scannerId, blockId) {
    return `${accountId}/scannedDocuments/${scannerId}/${blockId}`;
}

const getFileIdFromBlockUrl = function(blockUrl) {
    const urlSplitResult = blockUrl.split("/");
    const start = urlSplitResult.findIndex((path) => path === 'scannedDocuments') - 1;
    const resultUrl = urlSplitResult.slice(start).join("/");
    return resultUrl;
}

router.post('/:scannerId/blocks', express.raw({type:'*/*',inflate:true, limit: '100mb'}), async (req, res) => {
    // this is triggered when user send a readImageBlock to scanner, the scanner will upload the file to this endpoint
    const blockId = uuid.v4();
    const uri = getFileId(req, blockId);
    const fileBuffer = req.body;

    const user = await accountService.getAccountFromId(req.twain.principalId);
    const scannerId = req.params.scannerId;

    let scannerState = await getScannerStateFromScannerId(scannerId);
    scannerState.latestEvent = 'Uploading image to Cloud';
    
    logger.info(`uploading file to minio: ${uri}`);
    const bucket = await createBucket(user.id);
    if (bucket != true) {
        return res.status(500).send(bucket)
    }
    const object = await putObjectBuffer(user.id, uri, fileBuffer, blockId+'.pdf');
    if (object != true) {
        return res.status(500).send(object)
    }

    const url = await presignedGetObject(user.id, uri);


    return res.json(url)
});

router.get('/:scannerId/blocks', block.blockGet);

module.exports = router;
exports = module.exports;
exports.getFileIdFromBlockUrl = getFileIdFromBlockUrl;
exports.getFileIdFromArguments = getFileIdFromArguments