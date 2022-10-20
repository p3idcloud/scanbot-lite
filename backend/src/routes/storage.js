'use strict';
const { generatePdfDocument, getFileFromURI } = require('../controllers/storage.controller');
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

/**
 * @swagger
 * /api/storage/:
 *  post:
 *    summary: Generate merged PDF document from imageURI
 *    description: imageURI can be found in scan history job's detail
 *    security:
 *    - bearerAuth: []
 *    tags:
 *      - Storage
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              imageURI:
 *                type: array
 *                example: ["396cd224-4d99-4888-9a12-22b2f83e7f8d/scannedDocuments/3d7fb595-c06c-43e7-bded-46a7cced9978/cc7ae714-0b51-4c32-a372-bf50cd6ee2f6","396cd224-4d99-4888-9a12-22b2f83e7f8d/scannedDocuments/3d7fb595-c06c-43e7-bded-46a7cced9978/415e88a1-4e5b-4247-9aa7-adfca578aa28","396cd224-4d99-4888-9a12-22b2f83e7f8d/scannedDocuments/3d7fb595-c06c-43e7-bded-46a7cced9978/bf8d18b1-66c0-4271-b31c-efd7c2d22e1f"]
 *    responses:
 *      200:
 *        description: PDF File stream
 *        content:
 *          application/pdf:
 *              schema:
 *                  type: file
 *                  format: binary
 *      500:
 *        description: Error occured
 */
router.post('/', generatePdfDocument);

module.exports = router;