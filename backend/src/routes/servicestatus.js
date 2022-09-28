'use strict';
var router = require('express').Router();
const serviceStatus = require('../controllers/servicestatus.controller');

/**
 * @swagger
 *  /api/status/service:
 *   get:
 *    summary: Get service status
 *    description: Get service status
 *    tags:
 *      - Status
 *    responses:
 *     200:
 *      description: Get service status
 *     500:
 *      description: Service status failed
 */
router.get('/service', serviceStatus.getServiceStatus);

module.exports = router;