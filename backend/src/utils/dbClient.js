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

module.exports.getScannerById = function(scannerId) {
  logger.info(`Getting scanner with id: ${scannerId}`);
  const scanner = scannerIdToScanners[scannerId];
  if (!scanner) {
    return Promise.reject(new Error('No scanner with specified ID'));
  }
  
  return Promise.resolve(scanner);
};

module.exports.addScanner = function(scannerId, scanner) {
  logger.info(`Adding scanner with id: ${scannerId}`);
  scannerIdToScanners[scannerId] = scanner;

  return Promise.resolve();
};


module.exports.assignScanner = function(scannerId, accountId) {
  logger.info(`Assigning scanner with id: ${scannerId} to client: ${accountId}`);
  let scanners = accountIdToScannerIds[accountId];
  if (scanners) {
    scanners.push(scannerId);
  } 
  else {
    scanners = [scannerId];
  }
  accountIdToScannerIds[accountId] = scanners;

  return Promise.resolve();
};


module.exports.deleteScanner = function(scannerId) {
  logger.info(`Deleting scanner with id: ${scannerId}`);
  delete scannerIdToScanners[scannerId];

  return Promise.resolve();
};