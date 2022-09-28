'use strict';
const scannerState = require('../controllers/scannerstate.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  /api/scanners/state:
 *   get:
 *    summary: Get scanner state
 *    description: Get scanner states by query
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        description: Scanner state ID
 *      - in: query
 *        name: scannerId
 *        schema:
 *          type: string
 *        description: Scanner ID
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: Page of scanner list
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        description: Limit of scanner list
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *        description: Used to sorting the list
 *        example: createdAt
 *    tags:
 *      - Scanner State
 *    responses:
 *     200:
 *      description: Get all scanner state succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerState'
 *     500:
 *      description: Get all scanner state failure
 */
router.get('/', scannerState.getScannerStateFromQuery);

/**
 * @swagger
 *  /api/scanners/state/{id}:
 *   get:
 *    summary: Get one scanner state
 *    description: Get one scanner state
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Scanner State
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Scanner State Id
 *    responses:
 *     200:
 *      description: Get scanner state succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerSetting'
 *     500:
 *      description: Get scanner state failure
 */
router.get('/:scannerId', scannerState.getScannerStateFromScannerId);

/**
 * @swagger
 *  /api/scanners/state:
 *   post:
 *    summary: Create scanner state
 *    description: Create scanner state
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Scanner State
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerState'
 *    responses:
 *     200:
 *      description: Create scanner state succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerState'
 *     500:
 *      description: Create scanner state failure
 */
router.post('/', scannerState.createScannerState);

/**
 * @swagger
 *  /api/scanners/state/{id}:
 *   patch:
 *    summary: Update scanner state
 *    description: Update scanner state
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Scanner State
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Scanner state Id
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerState'
 *    responses:
 *     200:
 *      description: Update scanner state succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerState'
 *     500:
 *      description: Update scanner state failure
 */
router.patch('/:id', scannerState.updateScannerState);

/**
 * @swagger
 *  /api/scanners/state/{id}:
 *   delete:
 *    summary: Delete scanner state
 *    description: Delete scanner state
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Scanner State
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Scanner state Id
 *    responses:
 *     200:
 *      description: Delete scanner state succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerState'
 *     500:
 *      description: Delete scanner state failure
 */
router.delete('/:id', scannerState.deleteScannerState);

module.exports = router;