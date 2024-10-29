'use strict';
const account = require('../controllers/account.controller');
const express = require('express');
const router = express.Router();

router.get('/', account.getMe);

module.exports = router;