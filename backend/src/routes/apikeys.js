'use strict';
const apikeys = require('../controllers/apikeys.controller');

var express = require('express');
var router = express.Router();


/**
 * @swagger
 *  /api/api-keys/create:
 *   post:
 *    summary: Generate random api keys
 *    description: Generate random api keys
 *    tags:
 *      - ApiKeys
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *              name:
 *                type: string
 *    responses:
 *     200:
 *      description: Key and secret pair
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ApiKeys'
 *     500:
 *      description: Generate key-secret pair failure
 */
router.post('/create', apikeys.createApiKeys);

/**
 * @swagger
 * /api/api-keys/{apiKeyId}:
 *  delete:
 *   summary: Delete api key
 *   description: Can only be accessed by Account Admin role
 *   tags:
 *    - ApiKeys
 *   parameters:
 *    - in: path
 *      name: apiKeyId
 *      schema:
 *        type: string
 *      required: true
 *      description: API Key ID
 *   responses:
 *    200:
 *     description: Removed api key succesfully
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ApiKeys'
 *    400:
 *     description: Authentication error
 */
router.delete('/:apiKeyId', apikeys.deleteApiKey);



/**
 * @swagger
 * /api/api-keys/edit:
 *  put:
 *    summary: Update api key
 *    description: Can only change name
 *    security:
 *    - bearerAuth: []
 *    tags:
 *      - ApiKeys
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ApiKeys'
 *    responses:
 *      200:
 *        description: Successfully update api key
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiKeys'
 *      500:
 *        description: Update api key failure
 */
router.put('/edit', apikeys.updateApiKeyFromId);

module.exports = router;