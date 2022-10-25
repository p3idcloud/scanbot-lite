const ExerciseService = require('../services/exercise.service.js');
const { getAccountFromId } = require('../services/account.js');
const { getJobFromId } = require('../services/job.js');
const { getQueueFromId } = require('../services/queue.js');
const { getScannerHistoryFromId } = require('../services/scannerhistory.js');

async function getImageURIsFromScannerHistory(req, res) {
  try {
    const { principalId } = req.twain || {};
    if (!principalId?.length) throw new Error(`Please log in to your account`, { cause: 401 });

    const { id } = await getAccountFromId(principalId) || {};
    if (!id?.length) throw new Error(`Account does not exist`, { cause: 404 });

    const { scannerHistoryId } = req.params || {};
    if (!scannerHistoryId?.length) throw new Error(`No scannerHistoryId provided`, { cause: 400 });

    const { accountId, queueId } = await getScannerHistoryFromId(scannerHistoryId) || {};
    if (!accountId?.length || !queueId?.length) throw new Error(`Scanner history does not exist`, { cause: 404 });
    if (accountId !== id) throw new Error(`You have no permission to access this information`, { cause: 401 });

    const { jobId } = await getQueueFromId(queueId) || {};
    if (!jobId?.length) throw new Error(`No data found`, { cause: 404 });

    const { imageURI } = await getJobFromId(jobId) || {};
    if (!imageURI?.length) throw new Error(`No data found`, { cause: 404 });

    res.status(200).json({ imageURI });
  } catch (error) {
    res.status(error.cause || 500).json({ message: error.message || `Something went wrong` });
  }
}

async function mergePDFFromImageURIs(req, res) {
  try {
    const { principalId } = req.twain || {};
    if (!principalId?.length) throw new Error(`Please log in to your account`, { cause: 401 });

    const { id } = await getAccountFromId(principalId) || {};
    if (!id?.length) throw new Error(`Account does not exist`, { cause: 404 });

    const { imageURI } = req.body || {};
    if (!imageURI?.length) throw new Error(`No imageURI provided`, { cause: 400 });

    const [mergedPDF, error] = await ExerciseService.mergePDFFromImageURIs(id, imageURI);
    if (error) throw new Error(`Unable to merge pdf documents at this moment`, { cause: 408 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=ScanBot.pdf');
    res.end(mergedPDF);
  } catch (error) {
    res.status(error.cause || 500).json({ message: error.message || `Something went wrong` });
  }
}

module.exports = { getImageURIsFromScannerHistory, mergePDFFromImageURIs };
