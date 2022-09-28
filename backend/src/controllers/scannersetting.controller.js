'use strict';

// Service
const ScannerSettingService = require('../services/scannersetting');
const accountService = require('../services/account');

exports.getScannerSettingFromQuery = async (req, res) => {
    const account = await accountService.getAccountFromId(req.twain.principalId);
    let query = {};

    if (account) {
        if (req.query.id) {
            query.id = { '$eq': req.query.id };
        }

        if (req.query.name) {
            query.name = { '$regex' : '.*'+req.query.name+'.*', '$options' : '$i' };
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || 'createdAt';


        const setting = await ScannerSettingService.getScannerSettingFromQuery(query, page, limit, sort);

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

exports.getScannerSettingFromId = async (req, res) => {
    const id = req.params.id;
    const account = await accountService.getAccountFromId(req.twain.principalId);

    if (account) {
        const setting = await ScannerSettingService.getScannerSettingFromId(id);

        return res.send(setting);
    }

    return res.status(401).send('You need to login first!');
}

exports.createScannerSetting = async (req, res) => {
    const user = await accountService.getAccountFromId(req.twain.principalId);

    if (user) {
        const setting = await ScannerSettingService.createScannerSetting(req.body);

        return res.send(setting);
    }

    return res.status(401).send('You need to login first!');
}

exports.updateScannerSetting = async (req, res) => {
    const id = req.params.id;
    const account = await accountService.getAccountFromId(req.twain.principalId);

    if (account) {
        const setting = await ScannerSettingService.updateScannerSetting(id, req.body);

        return res.send(setting);
    }

    return res.status(401).send('You need to login first!');
}

exports.deleteScannerSetting = async (req, res) => {
    const id = req.params.id;
    const account = await accountService.getAccountFromId(req.twain.principalId);

    if (account) {
        const setting = await ScannerSettingService.deleteScannerSetting(id);

        return res.send(setting);
    }

    return res.status(401).send('You need to login first!');
}
