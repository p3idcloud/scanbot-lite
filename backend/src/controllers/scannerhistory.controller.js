'use strict';

// Service
const ScannerHistoryService = require('../services/scannerhistory');
const AccountService = require('../services/account');
const ScannerService = require('../services/scanner');
const QueueService = require('../services/queue');
const JobService = require('../services/job');
const { presignedGetObject, removeMinioObjects } = require('../lib/minio.lib');

exports.getScannerHistoryFromQuery = async (req, res) => {
    const account = await AccountService.getAccountFromId(req.twain.principalId);

    const scannerQuery = {};
    scannerQuery.accountId = {'$eq' : account.id}

    const scanners = await ScannerService.getScannersFromQuery(scannerQuery);

    let query = {};

    if (scanners.retValue.length > 0) {
        let queries = [];

        scanners.retValue.forEach(item => {
            if ( req.query.scannerId ) {
                if (req.query.scannerId == item.id ){
                    queries.push({ scannerId: item.id });
                }
            }else{
                queries.push({ scannerId: item.id });
            }
        });
        if (queries.length != 0) {
            query['$or'] = queries;
        }


    }

    if (account) {
        query.accountId = { '$eq': account.id };

        if (req.query.id) {
            query.id = { '$eq': req.query.id };
        }

        if (req.query.scannerId) {
            query.scannerId = { '$eq': req.query.scannerId };
        }

        if (req.query.name) {
            query.name = { '$regex' : '.*'+req.query.name+'.*', '$options' : '$i' };
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || 'createdAt';


        const setting = await ScannerHistoryService.getScannerHistoryFromQuery(query, page, limit, sort);

        let result = {
            data: setting.retValue,
            dataCount: setting.count,
            currentPage: page,
            pages: Math.ceil(setting.count/limit),
            query: query
        };
            
        return res.send(result)
    }

    return res.status(401).send('You need to login first!');
}

exports.getScannerHistoryFromId = async (req, res) => {
    const id = req.params.id;
    const account = await AccountService.getAccountFromId(req.twain.principalId);

    if (account) {
        const history = await ScannerHistoryService.getScannerHistoryFromId(id);
        if (history) {
            const scanner = await ScannerService.getScannerFromId(history.scannerId);
            
            if (scanner.accountId === account.id) {
                const queue = await QueueService.getQueueFromId(history.queueId);
                const job = await JobService.getJobFromId(queue.jobId);
                let url=[]

                for (let i=0;i<job.imageURI.length;i++){
                    url.push(process.env.BASE_URL+"api/storage/"+job.imageURI[i]);
                }

                return res.send({
                    history,
                    queue: queue,
                    job: job,
                    url: url
                });
            }
            return res.status(401).send('You have no permission to do this action!');
        }
        return res.status(404).send('History scanner not found!');
    }

    return res.status(401).send('You need to login first!');
}

exports.createScannerHistory = async (req, res) => {
    const account = await AccountService.getAccountFromId(req.twain.principalId);
    let data = req.body;

    if (account) {
        data.accountId = account.id;

        const setting = await ScannerHistoryService.createScannerHistory(data);

        return res.send(setting);
    }

    return res.status(401).send('You need to login first!');
}

exports.updateScannerHistory = async (req, res) => {
    const id = req.params.id;
    const account = await AccountService.getAccountFromId(req.twain.principalId);

    if (account) {
        const setting = await ScannerHistoryService.updateScannerHistory(id, req.body);

        return res.send(setting);
    }

    return res.status(401).send('You need to login first!');
}

exports.deleteScannerHistory = async (req, res) => {
    const id = req.params.id;
    const account = await AccountService.getAccountFromId(req.twain.principalId);

    if (account) {
        const scannerHistory = await ScannerHistoryService.getScannerHistoryFromId(id);
        const queue = await QueueService.getQueueFromId(scannerHistory.queueId);
        const job = await JobService.getJobFromId(queue.jobId);

        //remove minio files
        if (job.imageURI) {
            const minioremove = await removeMinioObjects(account.id, job.imageURI);
        }

        await JobService.deleteJob(job.id)
        await QueueService.deleteQueue(queue.id)
        const deleteScannerHistory = await ScannerHistoryService.deleteScannerHistory(id);
        return res.send(deleteScannerHistory);
    }

    return res.status(401).send('You need to login first!');
}
