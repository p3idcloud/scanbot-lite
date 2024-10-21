'use strict';
const opentext = require('../controllers/opentext.controller');

const express = require('express');
const router = express.Router();

router.post('/verify', opentext.verifyToken);
router.get('/auth', opentext.verifyTokenPlugin);
router.post('/upload', opentext.sendOCR);
router.get('/:id', opentext.FindOCRResult);

module.exports = router;