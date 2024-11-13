'use strict';
const account = require('../controllers/account.controller');
const express = require('express');
const router = express.Router();


/**
 * @swagger
 *  /api/me:
 *   get:
 *    summary: get current account
 *    description: get current account
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Accounts
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Account'
 *    responses:
 *     200:
 *      description: Update account succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Account'
 *     500:
 *      description: get account failure
 */

router.get('/', account.getMe);

/**
 * @swagger
 *  /api/me:
 *   patch:
 *    summary: Update current account
 *    description: Update current account
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Accounts
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Account'
 *    responses:
 *     200:
 *      description: Update account succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Account'
 *     500:
 *      description: Update account failure
 */
router.post('/', account.updateAccount);

module.exports = router;