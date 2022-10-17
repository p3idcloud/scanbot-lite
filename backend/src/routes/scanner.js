'use strict';

const scanner = require('../controllers/scanner.controller');
var router = require('express').Router();

/**
 * @swagger
 * /api/scanners:
 *  get:
 *   summary: Get all scanners
 *   description: Get all scanners
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        description: Scanner ID
 *      - in: query
 *        name: accountId
 *        schema:
 *          type: string
 *        description: Account ID
 *      - in: query
 *        name: userId
 *        schema:
 *          type: string
 *        description: User ID
 *      - in: query
 *        name: serialNo
 *        schema:
 *          type: string
 *        description: Serial number of scanner
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *        description: Scanner's name
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
 *   tags:
 *    - Scanners
 *   responses:
 *    200:
 *     description: Get all scanners succesfully
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Scanners'
 *    500:
 *     description: Get all scanners failure
 */
router.get('/', scanner.getScannersFromQuery); // read query

/**
 * @swagger
 * /api/scanners:
 *  post:
 *    summary: Create scanner
 *    description: Create a scanner
 *    security:
 *    - bearerAuth: []
 *    tags:
 *      - Scanners
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Scanner'
 *    responses:
 *      200:
 *        description: Successfully create scanner
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Scanner'
 *      500:
 *        description: Create scanner failure
 */
router.post('/', scanner.insertScanner); // create

/**
 * @swagger
 * /api/scanners/{scannerId}:
 *  patch:
 *    summary: Update scanner
 *    description: Update a scanner
 *    security:
 *    - bearerAuth: []
 *    tags:
 *      - Scanners
 *    parameters:
 *      - in: path
 *        name: scannerId
 *        schema:
 *          type: string
 *        required: true
 *        description: Scanner Id
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Scanner'
 *    responses:
 *      200:
 *        description: Successfully update scanner
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Scanner'
 *      500:
 *        description: Update scanner failure
 */
router.patch('/:scannerId', scanner.updateScannerFromId); // update :scannerid

// cloud-api routes
/**
 * @swagger
 * /api/scanners/{scannerId}:
 *  get:
 *   summary: Get Scanner Device Session ID
 *   description: Get Scanner Device Session ID from scannerID
 *   security:
 *    - bearerAuth: []
 *   tags:
 *    - Scanners
 *   parameters:
 *    - in: path
 *      name: scannerId
 *      schema:
 *        type: string
 *      required: true
 *      description: Scanner Id
 *   responses:
 *    200:
 *      description: Successfully get a scanner
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Scanner'
 *    500:
 *        description: Get one scanner failure
 */
router.get('/:scannerId', scanner.getScannerDeviceSessionFromId); // read :scannerid

/**
 * @swagger
 * /api/scanners/{scannerId}:
 *  delete:
 *   summary: Delete scanner
 *   description: Delete a scanner
 *   security:
 *    - bearerAuth: []
 *   tags:
 *    - Scanners
 *   parameters:
 *    - in: path
 *      name: scannerId
 *      schema:
 *        type: string
 *      required: true
 *      description: Scanner Id
 *   responses:
 *    200:
 *      description: Successfully delete scanner
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Scanner'
 *    500:
 *      description: Delete scanner failure
 */
router.delete('/:scannerId', scanner.deleteScannerFromId); // delete

router.get('/:scannerId/analytic', scanner.getScannerAnalytic);

module.exports = router;
