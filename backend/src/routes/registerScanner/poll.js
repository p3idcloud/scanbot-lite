'use strict';
const logger = require('../../utils/logger')('api-poll');
const scanserv = require("../../services/scanner")

var express = require('express');
var router = express.Router();

router.get('/:scannerId', async function(req, res, next) {
  const scannerId = req.params.scannerId;

  if (!scannerId) {
    next(new Error('Missing scannerId query parameter.'));
  }

  await scanserv.getScannerFromId(scannerId)
  .then(scanner => {
    if (!scanner) {
      logger.warn('Nothing was found for provided scannerId: ' + scannerId);
      throw new Error('Invalid scanner id.');
    }

    if (!scanner.clientId) {
      logger.warn('Scanner is not assigned to a client yet.');
      res.status(202).json({ message: "Scanner is not assigned yet."});
      return;
    }

    // TODO: generate access/refresh tokens

    const response = {
      success: true,
      authorizationToken: scanner.loginToken,
      refreshToken: scanner.loginToken
    }

    res.json(response);
    
    //{"success":true,"authorizationToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MTExZjI0ODA4NzZmMTJmN2M3YmYzN2ZhNTM3ZDgwZDFjOTU5OWNhIiwidHdhaW4iOnsicm9sZSI6ImRldmljZSIsImRldmljZSI6ImRmZDg1M2U4LTY3MmQtNDZmMi1hN2U0LTMzNjNlOTM4N2U0NCJ9LCJpYXQiOjE2MjY5MDk1MzQsImV4cCI6MTYyNjkxMzEzNCwiYXVkIjoiaHR0cHM6Ly92YXN0LnZpc2lvbmVlci5jb20iLCJpc3MiOiJWaXNpb25lZXIifQ.qoWN2A4sfr1FvAAmp1kkasCW-yn7GSv38v65xXwc_LA","refreshToken":"0d1f0cd4a58764cf911eab23409905b80326b7ccec8359d18d42a546e0ae4a6fbf78be03806acc3840238bfb69e08826"}

    // res.send("Found. Redirecting to http://localhost:3000/scanners/register?registrationToken="+reqtoken+"&authorization_token="+tokens.authorizationToken+"&refresh_token="+tokens.refreshToken);

    /*
    return cache.saveRefreshToken(scannerId)
    .then(token => {
      const providerConfig = config({ provider: '', stage: event.stage });
      const data = Object.assign(createResponseData(scannerId), { refreshToken: token });
      const authorizationToken = utils.createToken(data.authorizationToken.payload, providerConfig.token_secret, data.authorizationToken.options);
      callback(null, { success: true, authorizationToken, refreshToken: token });
    });
    */
  })
  .catch(error => {
    logger.error(error);
    res.status(500).send({ success: false, message: 'Unknown scanner identifier' });
  });
});

module.exports = router;