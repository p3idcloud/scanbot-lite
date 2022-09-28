'use strict';
const logger = require('./logger')('dbClient');

var clientIdToScannerIds = {};
var scannerIdToScanners = {};

// TODO: replace with promise / async
module.exports.getScanners = function(clientId) {
  logger.info(`Loading scanners for clientId: ${clientId}`);
  const scannerIds = clientIdToScannerIds[clientId] || [];

  const scanners = scannerIds
    .map(id => scannerIdToScanners[id])
    .filter(scanner => scanner);

  return Promise.resolve(scanners);
};