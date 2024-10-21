'use strict';
const plugin = require('../controllers/plugin.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  /api/plugins:
 *   get:
 *    summary: Get all plugins
 *    description: Get all plugins by query
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        description: Plugin ID
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *        description: Plugin's name
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: Page of plugin list
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        description: Limit of plugin list
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *        description: Used to sorting the list
 *        example: createdAt
 *    tags:
 *      - Plugins
 *    responses:
 *     200:
 *      description: Get all plugins succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Plugins'
 *     500:
 *      description: Get all plugins failure
 */
router.get('/', plugin.getPluginFromQuery);

/**
 * @swagger
 *  /api/plugins/{id}:
 *   get:
 *    summary: Get one plugin
 *    description: Get one plugin
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Plugin ID
 *    tags:
 *      - Plugins
 *    responses:
 *     200:
 *      description: Get plugin succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Plugins'
 *     500:
 *      description: Get plugin failure
 */
router.get('/:name', plugin.getPluginFromName);

/**
 * @swagger
 *  /api/plugins/{id}:
 *   patch:
 *    summary: Update plugin
 *    description: Update plugin
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Plugins
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Plugin Id
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Plugin'
 *    responses:
 *     200:
 *      description: Update plugin succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Plugin'
 *     500:
 *      description: Update plugin failure
 */
router.patch('/', plugin.updatePlugin);

module.exports = router;