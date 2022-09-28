'use strict';
const express = require('express');
const register = require('../controllers/register.controller');
const router = express.Router();

router.post('/', register.registerScanner);

module.exports = router;