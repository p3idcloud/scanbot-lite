'use strict';
const db = require('../models')
const Scanner = db.scanner

// services
const scanserv = require("../services/scanner")
const accountService = require("../services/account")
const scannerHistoryService = require("../services/scannerhistory")
const {getScannerStateFromScannerId, updateScannerState, resetScannerState} = require("../services/scannerstate");

exports.check = () => {
    Scanner.find().then(result => {
        if (result.length === 0) {
            const scanner = new Scanner({
                id: '1',
                user: '1',
                name: 'test scanner1',
                description: 'testing scanner API'
            })
            Scanner(scanner).save()
        }
    })
}

exports.insertScanner = async (req, res) => {
    if (req.twain.principalId) {
        const userId = req.twain.principalId;

        let scanner = req.body

        if (userId) {
            const user = await accountService.getAccountFromId(req.twain.principalId)
            if (!user) {
                return res.status(400).send("Couldn't find user")
            }

            scanner.accountId = userId;

            const result = await scanserv.createScanner(scanner)
            return res.send(result)
        }
    }

    return res.status(401).send('Can not access this feature. You need to login first!');
}

exports.getScannersFromQuery = async (req, res) => { //SWR standard
    const account = await accountService.getAccountFromId(req.twain.principalId)
    if (!account) {
        return res.status(400).send("Couldn't find account")
    }

    //initial query
    let query = {}

    //scope account / userid
    query.accountId = {'$eq' : account.id}

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
    const sort = req.query.sort || "-lastActive"
    
    const qValues = await scanserv.getScannersFromQuery(query, page, limit, sort)

    let result = {
        data: qValues.retValue,
        dataCount: qValues.count,
        currentPage: page,
        pages: Math.ceil(qValues.count/limit),
        query: query
    }
    
    return res.send(result)
}

exports.getScannerDeviceSessionFromId = async (req, res) => {
    const scannerId = req.params.scannerId
    //get user from token
    const account = await accountService.getAccountFromId(req.twain.principalId)
    if (!account) {
        return res.status(400).send("Couldn't find account")
    }

    const scanner = await scanserv.getScannerFromId(scannerId)
    if (!scanner) {
        return res.status(400).send("Couldn't find scanner")
    }
    
    if (scanner.accountId !== account.id) {
        return res.status(400).send("Scanner doesn't belong to user")
    }

    const scannerDeviceSession = await scanserv.getScannerDeviceSessionFromId(scannerId)
    const result = {...scannerDeviceSession, scanner}
    // console.log(result);

    //scanner connected to service
    if (req.query.ui != 'true') {
        await resetScannerState(scannerId);
    }

    return res.send(result)
}

exports.deleteScannerFromId = async (req, res) => {
    if (req.twain.principalId) {
        const accountId = req.twain.principalId;

        if (accountId) {
            const scannerId = req.params.scannerId;

            //get user from token
            const account = await accountService.getAccountFromId(req.twain.principalId)
            if (!account) {
                return res.status(400).send("Couldn't find account")
            }

            const scanner = await scanserv.deleteScannerFromId(scannerId)

            return res.send(scanner)
        }
    }

    return res.status(401).send('Can not access this feature. You need to login first!');
}

exports.updateScannerFromId = async (req, res) => {
    if (req.twain.principalId) {
        const accountId = req.twain.principalId;

        if (accountId) {
            const scannerId = req.params.scannerId;
            const updateScanner = req.body

            const account = await accountService.getAccountFromId(req.twain.principalId)
            if (!account) {
                return res.status(400).send("Couldn't find account")
            }

            const scanner = await scanserv.updateScannerFromId(scannerId,updateScanner)

            return res.send(scanner)
        }
    }

    return res.status(401).send('Can not access this feature. You need to login first!');
}

exports.getScannerAnalytic = async (req, res) => {
    const account = await accountService.getAccountFromId(req.twain.principalId);
    if (!account) {
        return res.status(400).send("Couldn't find account")
    }

    const totalScanHistory = await scannerHistoryService.totalScanHistory(req.params.scannerId, account.id)
    const totalPageScan = await scannerHistoryService.totalPageScan(req.params.scannerId, account.id)

    return res.send({
        totalScan: totalScanHistory ?? 0,
        totalPageScan: totalPageScan[0]?.total ?? 0
    })
}