'use strict';
const { getFileFromURI } = require('../controllers/storage.controller');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/storage/{imageUri}:
 *  get:
 *    summary: Get PDF stream from imageUri
 *    description: imageURi can be found in scan history detail
 *    security:
 *    - bearerAuth: []
 *    tags:
 *      - Storage
 *    parameters:
 *      - in: path
 *        name: imageUri
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: PDF File stream
 *        content:
 *          application/pdf:
 *              schema:
 *                  type: file
 *                  format: binary
 *      400:
 *        description: File not found / file not belong to this account
 */
router.get('/:uri*', getFileFromURI);

module.exports = router;