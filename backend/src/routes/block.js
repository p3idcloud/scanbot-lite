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

//idk how to fix this , i cannot move these code into blocks.controller , it makes 404
router.post('/:scannerId/blocks', express.raw({type:'*/*',inflate:true, limit: '100mb'}), async (req, res) => {
    // this is triggered when user send a readImageBlock to scanner, the scanner will upload the file to this endpoint
    const blockId = uuid.v4();
    const uri = getFileId(req, blockId);
    const fileBuffer = req.body;
    
    const user = await accountService.getAccountFromId(req.twain.principalId);
    const scannerId = req.params.scannerId;

    // get & update scannerstate
    let scannerState = await getScannerStateFromScannerId(scannerId);
    scannerState.latestEvent = 'Uploading image to Cloud';
    

    // get Queue From ScannerState
    const queue = await getQueueFromId(scannerState.currentQueueId);

    // get & update Job from Queue
    let job = await getJobFromId(queue.jobId);

    // //upload the file to minio
    logger.info(`uploading file to minio: ${uri}`);
    const bucket = await createBucket(user.id);
    if (bucket != true) {
        return res.status(500).send(bucket)
    }
    const object = await putObjectBuffer(user.id, uri, fileBuffer, blockId+'.pdf');
    if (object != true) {
        return res.status(500).send(object)
    }

    // //update job
    jobService.pushInsertImageURI(job.id, uri)
    ScannerHistory.incrementPageCount(queue.id);

    //get presigned minio url
    const url = await presignedGetObject(user.id, uri);

    //append url to scannerState
    // scannerState.imageUrl.push(url);
    // await updateScannerState(scannerState.scannerId, scannerState);
    // the code above are unsafe
    const newScannerState = await pushInsertImageURI(scannerState.scannerId, url);


    return res.json(url)

    //in case cannot pipe, this is technically bad
    // const blockId = uuid.v4();
    // const fileId = getFileId(req, blockId);
    // const fileContent = req.body;

    // logger.info(`saving file: ${fileId}`);  
    // ensureDirectoryExistence(fileId)
    // .then(() => writeFile(fileId, fileContent))
    // .catch(next);
});

router.get('/:scannerId/blocks', block.blockGet);

module.exports = router;