'use strict';
const express = require('express');
const local = require('../controllers/local.controller');
const router = express.Router();

router.all('/:scannerId/infoex', local.allLocal);
router.all('/:scannerId/twaindirect/session', local.allLocal);

module.exports = router;