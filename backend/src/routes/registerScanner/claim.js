'use strict';
const db = require('../../utils/dbClient');
const logger = require('../../utils/logger')('api-claim');
const scanserv = require("../../services/scanner");
const accountService = require('../../services/account');

var express = require('express');
var router = express.Router();

function generateToken(n) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var token = '';
  for(var i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

router.post('/',async function(req, res, next) {
  const account = await accountService.getAccountFromId(req.twain.principalId);
  const clientId = account.id;
  const claimInfo = req.body;

  //const scannerId = claimInfo.scannerId;
  const token = claimInfo.registrationToken;
  const scanner = await scanserv.getScannerFromToken(token)
  //.then(scanner => {
  try{
    logger.info('retrieved scanner: ' + scanner);

    if (!scanner) {
      res.status(400).send({
        message: 'Invalid token: ' + claimInfo.registrationToken
      });
      next(new Error('Invalid token: ' + claimInfo.registrationToken));
    }

    if (scanner.registrationToken === claimInfo.registrationToken) {

      // TODO: simplify this
      scanner.registrationToken = null;
      scanner.clientId = clientId;
      scanner.accountId = account.id;
      scanner.loginToken = generateToken(36)

      let ascanner = await scanserv.updateScannerFromId(scanner.id, scanner);
      return res.send(ascanner);
    }
    else {
      res.status(400).send({
        message: 'Invalid scanner id: ' + claimInfo.scannerId
      });
      next(new Error('Invalid scanner id: ' + claimInfo.scannerId));
    }
  } catch(e){
    console.log(e);
  }
  //.catch(next);
});

module.exports = router;