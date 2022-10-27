const AccountService = require('../services/account.js');
const ExerciseService = require('../services/exercise.service.js');

async function mergePDFFromURIs(req, res) {
  try {
    const { principalId } = req.twain || {};
    if (!principalId?.length) throw new Error(`No principalId provided`, { cause: 400 });

    const { id } = await AccountService.getAccountFromId(principalId) || {};
    if (!principalId?.length) throw new Error(`Account does not exist`, { cause: 404 });

    const { imageURI } = req.body || {};
    if (!imageURI?.length) throw new Error(`No imageURI provided`, { cause: 400 });

    const [mergedPDF, error] = await ExerciseService.mergePDFFromURIs(id, imageURI);
    if (error) throw new Error(`Unable to merge pdf documents at this moment`, { cause: 408 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=ScanBot.pdf');
    res.end(mergedPDF);
  } catch (error) {
    res.status(error.cause || 500).json({ message: error.message || `Something went wrong` });
  }
}

module.exports = { mergePDFFromURIs };
