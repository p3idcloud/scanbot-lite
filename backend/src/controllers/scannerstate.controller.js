'use strict';

// Service
const ScannerStateService = require('../services/scannerstate');
const accountService = require('../services/account');
const ScannerService = require('../services/scanner');
const ROLE_CONST = require("../constants/role");

exports.getScannerStateFromQuery = async (req, res) => {
    const account = await accountService.getAccountFromId(req.twain.principalId);

    const scannerQuery = {};

    scannerQuery.accountId = {'$eq' : account.id}

    const scanners = await ScannerService.getScannersFromQuery(scannerQuery);

    let query = {};

    if (scanners.retValue.length > 0) {
        let queries = [];

        scanners.retValue.forEach(item => {
            queries.push({ scannerId: item.id });
        });

        query['$or'] = queries;
    }

    if (account) {
        if (req.query.id) {
            query.id = { '$eq': req.query.id };
        }

        if (req.query.scannerId) {
            query.scannerId = { '$eq': req.query.scannerId };
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || 'createdAt';


        const state = await ScannerStateService.getScannerStateFromQuery(query, page, limit, sort);

        let result = {
            data: state.retValue,
            dataCount: state.count,
            currentPage: page,
            pages: Math.ceil(state.count/limit),
            query: query
        };

        return res.send(result)
    }

    return res.status(401).send('You need to login first!');
}

exports.getScannerStateFromScannerId = async (req, res) => {
    const scannerId = req.params.scannerId;
    const account = await accountService.getAccountFromId(req.twain.principalId);
    const state = await ScannerStateService.getScannerStateFromScannerId(scannerId);

    if (account) {
        if (state) {
            //reset state if time exceed 300 seconds
            if (state.lastCommandAt != null && Math.abs(Date.now() - state.lastCommandAt)/1000 >= process.env.SESSION_TIMEOUT ) {
                await ScannerStateService.resetScannerState(scannerId);
            }

            const scanner = await ScannerService.getScannerFromId(state.scannerId);

            if (scanner.accountId === account.id) {
                if ( state.currentlyUsedByUserId === '' || state.currentlyUsedByUserId === account.id || !state.currentlyUsedByUserId ){
                    return res.send(state);
                }else{
                    const userusing = await accountService.getAccountFromId(state.currentlyUsedByUserId);
                    let retValue = {}
                    retValue = JSON.parse(JSON.stringify(state))
                    retValue.usedBy = {};
                    retValue.usedBy.name = userusing.fullname;
                    retValue.usedBy.email = userusing.email;

                    return res.status(400).send(retValue);
                }
            }

            return res.status(401).send('You have no permission to do this action!');
        }

        return res.status(404).send('State scanner not found!');
    }

    return res.status(401).send('You need to login first!');
}

exports.createScannerState = async (req, res) => {
    const account = await accountService.getAccountFromId(req.twain.principalId);

    if (account) {
        const state = await ScannerStateService.createScannerState(req.body);

        return res.send(state);
    }

    return res.status(401).send('You need to login first!');
}

exports.updateScannerState = async (req, res) => {
    const id = req.params.id;
    const account = await accountService.getAccountFromId(req.twain.principalId);

    if (account) {
        const state = await ScannerStateService.updateScannerState(id, req.body);

        return res.send(state);
    }

    return res.status(401).send('You need to login first!');
}

exports.deleteScannerState = async (req, res) => {
    const id = req.params.id;
    const account = await accountService.getAccountFromId(req.twain.principalId);

    if (account) {
        const state = await ScannerStateService.deleteScannerState(id);

        return res.send(state);
    }

    return res.status(401).send('You need to login first!');
}