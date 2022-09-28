'use strict';
const scannerSetting = require('../controllers/scannersetting.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  /api/scannersetting:
 *   get:
 *    summary: Get scanner settings
 *    description: Get scanner settings by query
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        description: Scanner setting ID
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *        description: Scanner's name
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: Page of scanner setting list
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        description: Limit of scanner setting list
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *        description: Used to sorting the list
 *        example: createdAt
 *    tags:
 *      - Scanner Setting
 *    responses:
 *     200:
 *      description: Get all scanner setting succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerSettings'
 *     500:
 *      description: Get all scanner setting failure
 */
router.get('/', scannerSetting.getScannerSettingFromQuery);

/**
 * @swagger
 *  /api/scannersetting/{id}:
 *   get:
 *    summary: Get one scanner setting
 *    description: Get one scanner setting
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Scanner Setting
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Scanner Setting Id
 *    responses:
 *     200:
 *      description: Get scanner setting succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerSetting'
 *     500:
 *      description: Get scanner setting failure
 */
router.get('/:id', scannerSetting.getScannerSettingFromId);

/**
 * @swagger
 *  /api/scannersetting:
 *   post:
 *    summary: Create scanner setting
 *    description: Create scanner setting
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Scanner Setting
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerSetting'
 *    responses:
 *     200:
 *      description: Create scanner setting succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerSetting'
 *     500:
 *      description: Create scanner setting failure
 */
router.post('/', scannerSetting.createScannerSetting);

/**
 * @swagger
 *  /api/scannersetting/{id}:
 *   patch:
 *    summary: Update scanner setting
 *    description: Update scanner setting
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Scanner Setting
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Scanner setting Id
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerSetting'
 *    responses:
 *     200:
 *      description: Update scanner setting succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerSetting'
 *     500:
 *      description: Update scanner setting failure
 */
router.patch('/:id', scannerSetting.updateScannerSetting);

/**
 * @swagger
 *  /api/scannersetting/{id}:
 *   delete:
 *    summary: Delete scanner setting
 *    description: Delete scanner setting
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Scanner Setting
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Scanner setting Id
 *    responses:
 *     200:
 *      description: Delete scanner setting succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ScannerSetting'
 *     500:
 *      description: Delete scanner setting failure
 */
router.delete('/:id', scannerSetting.deleteScannerSetting);

module.exports = router;