const ExerciseController = require('../controllers/exercise.controller.js');
const { Router } = require('express');

const router = Router();

/* endpoint for health check */
router.get('/', (_, res) => res.sendStatus(200));

/* endpoint to download merged pdf documents from scanner history */
/**
 * @swagger
 *  /api/exercise/mergepdf/{scannerHistoryId}:
 *   get:
 *    summary: Merge pdf
 *    description: Merge PDF from scannerHistoryId
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: scannerHistoryId
 *        required: true
 *        schema:
 *         type: string
 *         minimum: 1
 *        description: Scanner History Id
 *    tags:
 *      - Exercise
 *    responses:
 *     200:
 *      description: Merged PDF as response.
 *      content:
 *         application/pdf:
 *           schema:
 *             type: string
 *             format: binary
 *     500:
 *      description: Failed
 */
router.get(
  '/mergepdf/:scannerHistoryId',
  ExerciseController.getImageURIsFromScannerHistory,
  ExerciseController.mergePDFFromImageURIs,
  ExerciseController.serveMergedPDFResult
);


/* endpoint to save pdf documents from scanner history to google drive */
/**
 * @swagger
 *  /api/exercise/savetodrive/{scannerHistoryId}:
 *   get:
 *    summary: Save PDF to google drive
 *    description: Save PDF from scannerHistoryId
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: scannerHistoryId
 *        required: true
 *        schema:
 *         type: string
 *         minimum: 1
 *        description: Scanner History Id
 *    tags:
 *      - Exercise
 *    responses:
 *     200:
 *      description: SUCCESS.
 *      content:
 *        application/pdf:
 *     500:
 *      description: Failed
 */
router.get(
  '/savetodrive/:scannerHistoryId',
  ExerciseController.getImageURIsFromScannerHistory,
  ExerciseController.mergePDFFromImageURIs,
  ExerciseController.savePDFToDrive
);

/* handler for invalid endpoints */
router.use((_, res) => res.sendStatus(404));

module.exports = router;
