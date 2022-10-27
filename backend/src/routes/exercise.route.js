const { Router } = require('express');
const ExerciseController = require('../controllers/exercise.controller.js');

const router = Router();

router.get('/', (_, res) => res.sendStatus(200)); // endpoint for health check
router.post('/mergepdf', ExerciseController.mergePDFFromURIs); // endpoint to merge pdf documents


module.exports = router;
