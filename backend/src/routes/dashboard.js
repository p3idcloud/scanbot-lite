'use strict';
const dashboard = require('../controllers/dashboard.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  /api/dashboard:
 *   get:
 *    summary: Get scanners count
 *    description: Get scanners count
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Dashboards
 *    responses:
 *     200:
 *      description: Get all data succesfully
 *     500:
 *      description: Get all data failure
 */
router.get('/', dashboard.getScannersCount); // read

module.exports = router;