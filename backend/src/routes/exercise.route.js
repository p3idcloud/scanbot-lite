const ExerciseController = require('../controllers/exercise.controller.js');
const { Router } = require('express');

const router = Router();

/* endpoint for health check */
router.get('/', (_, res) => res.sendStatus(200));

/* endpoint to download merged pdf documents from scanner history */
router.get(
  '/mergepdf/:scannerHistoryId',
  ExerciseController.getImageURIsFromScannerHistory,
  ExerciseController.mergePDFFromImageURIs,
  ExerciseController.serveMergedPDFResult
);

/* endpoint to save pdf documents from scanner history to google drive */
router.get(
  '/savetodrive/:scannerHistoryId',
  ExerciseController.getImageURIsFromScannerHistory,
  ExerciseController.mergePDFFromImageURIs,
  ExerciseController.savePDFToDrive
);

/* handler for invalid endpoints */
router.use((_, res) => res.sendStatus(404));

module.exports = router;
