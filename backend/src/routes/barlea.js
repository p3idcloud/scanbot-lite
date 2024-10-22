'use strict';
const barlea = require('../controllers/barlea.controller');

const express = require('express');
const router = express.Router();

router.post('/upload', barlea.sendBarlea);

module.exports = router;