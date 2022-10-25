const { Router } = require('express');
const ExerciseController = require('../controllers/exercise.controller.js');

const router = Router();

/* endpoint for health check */
router.get('/', (_, res) => res.sendStatus(200));

/* endpoint to get imageuris from scanner history */
router.get('/imageuris/:scannerHistoryId', ExerciseController.getImageURIsFromScannerHistory);

/* endpoint to merge pdf documents */
router.post('/mergepdf', ExerciseController.mergePDFFromImageURIs);


module.exports = router;
