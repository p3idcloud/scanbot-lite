'use strict';
const scannerHistory = require('../controllers/scannerhistory.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  /api/scanners/history:
 *   get:
 *    summary: Get scanner histories
 *    description: Get scanner histories by query
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: scannerId
 *        schema:
 *          type: string
 *        description: Scanner id
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        description: Scanner history id
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *        description: Scanner history name
 *      - in: query
 *        name: page
 *        schema:
 *          type: string
 *        description: Scanner history page
 *      - in: query
 *        name: query
 *        schema:
 *          type: string
 *        description: Scanner history query
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *        description: Scanner history sort
 *    tags:
 *      - Scanner History
 *    responses:
 *     200:
 *      description: Get all scanner history succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerHistories'
 *     500:
 *      description: Get all scanner history failure
 */
router.get('/', scannerHistory.getScannerHistoryFromQuery);

/**
 * @swagger
 *  /api/scanners/history/{id}:
 *   get:
 *    summary: Get one scanner history detail
 *    description: Get one scanner history detail
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Scanner History Id
 *    tags:
 *      - Scanner History
 *    responses:
 *     200:
 *      description: Get scanner history succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerHistory'
 *     500:
 *      description: Get scanner history failure
 */
router.get('/:id', scannerHistory.getScannerHistoryFromId);

/**
 * @swagger
 *  /api/scanners/history:
 *   post:
 *    summary: Create scanner history
 *    description: Create scanner history
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Scanner History
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerHistory'
 *    responses:
 *     200:
 *      description: Create scanner history succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerHistory'
 *     500:
 *      description: Create scanner history failure
 */
router.post('/', scannerHistory.createScannerHistory);

/**
 * @swagger
 *  /api/scanners/history/{id}:
 *   patch:
 *    summary: Update scanner history
 *    description: Update scanner history
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Scanner History
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Scanner history Id
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerHistory'
 *    responses:
 *     200:
 *      description: Update scanner history succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerHistory'
 *     500:
 *      description: Update scanner history failure
 */
router.patch('/:id', scannerHistory.updateScannerHistory);

/**
 * @swagger
 *  /api/scanners/history/{id}:
 *   delete:
 *    summary: Delete scanner history
 *    description: Delete scanner history
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Scanner History
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Scanner history Id
 *    responses:
 *     200:
 *      description: Delete scanner history succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerHistory'
 *     500:
 *      description: Delete scanner history failure
 */
router.delete('/:id', scannerHistory.deleteScannerHistory);

module.exports = router;