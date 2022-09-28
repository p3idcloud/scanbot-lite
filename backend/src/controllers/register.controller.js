'use strict';

const uuid = require('uuid');
const db = require('../utils/dbClient');
const logger = require('../utils/logger')('api-register-new');
const scanserv = require('../services/scanner');
const scanstate = require('../services/scannerstate');

var express = require('express');
var router = express.Router();

exports.registerScanner = async (req, res, next) => {
    const scannerInfo = req.body;
    logger.debug(scannerInfo);
    logger.debug(req.headers);

    const scannerId = uuid.v4();
    const registrationToken = uuid.v4().substring(0, 8); // Use 8 "random" symbols as registration token

    scannerInfo.id = scannerId;
    scannerInfo.registrationToken = registrationToken;

    logger.info(`Persisting scanner with id: ${scannerId} and registration token: ${registrationToken}`);

    await scanserv.createScanner(scannerInfo)

    const pollQueryString = `/${scannerId}`;
    const registerQueryString = `?registrationToken=${registrationToken}`;
    let baseUrl = `${process.env.BASE_URL}`;

    var schema = req.headers["x-scheme"];
    if (schema === "https") {
        baseUrl = `${process.env.BASE_URL}`;
    }

    const response = {
        scannerId: scannerId,
        registrationToken: registrationToken,
        pollingUrl: baseUrl + 'api/poll' + pollQueryString,
        inviteUrl: process.env.FRONTEND_URL + 'scanners/register'+ registerQueryString
    };

    const scannerState = {
        id: uuid.v4(),
        scannerId: scannerId,
        pollingUrl: response.pollingUrl,
        inviteUrl: response.inviteUrl,
        status: "ready",
    };
    await scanstate.createScannerState(scannerState);

    logger.debug(response);
    return res.json(response);
}