'use strict';
const logger = require('./logger')('dbClient');

var accountIdToScannerIds = {};
var scannerIdToScanners = {};

// TODO: replace with promise / async
module.exports.getScanners = function(accountId) {
  logger.info(`Loading scanners for accountId: ${accountId}`);
  const scannerIds = accountIdToScannerIds[accountId] || [];

  const scanners = scannerIds
    .map(id => scannerIdToScanners[id])
    .filter(scanner => scanner);

  return Promise.resolve(scanners);
};