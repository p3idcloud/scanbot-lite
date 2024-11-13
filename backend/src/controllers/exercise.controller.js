const ExerciseService = require('../services/exercise.service.js');
const { getAccountFromId } = require('../services/account.js');
const { getJobFromId } = require('../services/job.js');
const { getQueueFromId } = require('../services/queue.js');
const { getScannerHistoryFromId } = require('../services/scannerhistory.js');
const isEmpty = require('../utils/isEmpty.js');
const { retrieveC2paPdf } = require('./c2pa.controller.js');

async function getImageURIsFromScannerHistory(req, res, next) {
  try {
    const { principalId } = req.twain || {};
    if (isEmpty(principalId)) throw new Error(`Please log in to your account`, { cause: 401 });

    const { id } = await getAccountFromId(principalId) || {};
    if (isEmpty(id)) throw new Error(`Account does not exist`, { cause: 404 });

    const { accountId, queueId } = await getScannerHistoryFromId(req.params['scannerHistoryId']) || {};
    if (isEmpty(accountId) || isEmpty(accountId)) throw new Error(`Scanner history does not exist`, { cause: 404 });
    if (accountId !== id) throw new Error(`You have no permission to access this information`, { cause: 403 });

    const { jobId } = await getQueueFromId(queueId) || {};
    if (isEmpty(jobId)) throw new Error(`No data found`, { cause: 404 });

    const { imageURI } = await getJobFromId(jobId) || {};
    if (isEmpty(imageURI)) throw new Error(`No data found`, { cause: 404 });

    req.imageURI = imageURI;
    next();
  } catch (error) {
    res.status(error.cause || 500).json({ message: error.message || `Something went wrong` });
  }
}

async function mergePDFFromImageURIs(req, res, next) {
  try {
    const { principalId } = req.twain || {};
    if (isEmpty(principalId)) throw new Error(`Please log in to your account`, { cause: 401 });

    const { id } = await getAccountFromId(principalId) || {};
    if (isEmpty(id)) throw new Error(`Account does not exist`, { cause: 404 });

    const [mergedPDF, error] = await ExerciseService.mergePDFFromImageURIs(id, req.imageURI);
    if (error) throw new Error(`Unable to merge pdf documents at this moment`, { cause: 408 });

    req.mergedPDF = mergedPDF;
    next();
  } catch (error) {
    res.status(error.cause || 500).json({ message: error.message || `Something went wrong` });
  }
}

async function savePDFToDrive(req, res) {
  try {
    const [result, error] = await ExerciseService.savePDFToDrive(req.mergedPDF);
    if (error) throw new Error(`Unable to save pdf documents at this moment`, { cause: 408 });

    res.status(200).json({ message: `PDF documents saved to Google Drive`, info: result });
  } catch (error) {
    res.status(error.cause || 500).json({ message: error.message || `Something went wrong` });
  }
}

async function serveMergedPDFResult(req, res) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=ScanBot.pdf');
  res.status(200).send(req.mergedPDF);
}

async function getFileTest(req, res) {
  const uri = "5dcf5d5b-576a-4a55-819e-0dd47da7b7db/scannedDocuments/65fd075d-cee3-4703-9108-8a03acef0d08/af8869d4-682d-4b1f-81c0-9a90f1a20ef2"
  const pdfResult = await retrieveC2paPdf("5dcf5d5b-576a-4a55-819e-0dd47da7b7db",uri)
  res.send(pdfResult)
}

module.exports = { getImageURIsFromScannerHistory, mergePDFFromImageURIs, savePDFToDrive, serveMergedPDFResult, getFileTest };
