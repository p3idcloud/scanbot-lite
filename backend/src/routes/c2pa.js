'use strict';

const c2pa = require('../controllers/c2pa.controller');
var router = require('express').Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', c2pa.c2paSigningManifest);

router.post('/read',upload.single('file'), c2pa.c2paReadFile);

module.exports = router;