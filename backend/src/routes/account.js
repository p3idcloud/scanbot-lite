'use strict';
const account = require('../controllers/account.controller');

const Multer = require('multer');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  /api/accounts:
 *   get:
 *    summary: Get all accounts
 *    description: Get all accounts by query
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        description: Account ID
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *        description: Account's name
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: Page of account list
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        description: Limit of account list
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *        description: Used to sorting the list
 *        example: createdAt
 *    tags:
 *      - Accounts
 *    responses:
 *     200:
 *      description: Get all accounts succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Accounts'
 *     500:
 *      description: Get all accounts failure
 */
router.get('/', account.getAccountFromQuery);

/**
 * @swagger
 *  /api/accounts/{id}:
 *   get:
 *    summary: Get one account
 *    description: Get one account
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Account ID
 *    tags:
 *      - Accounts
 *    responses:
 *     200:
 *      description: Get account succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Accounts'
 *     500:
 *      description: Get account failure
 */
router.get('/:id', account.getAccountFromId);

/**
 * @swagger
 *  /api/accounts:
 *   post:
 *    summary: Create account
 *    description: Create account
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
 *      description: Create account succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Account'
 *     500:
 *      description: Create account failure
 */
router.post('/', account.createAccount);

/**
 * @swagger
 *  /api/accounts/{id}:
 *   delete:
 *    summary: Delete account
 *    description: Delete account
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Accounts
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Account Id
 *    responses:
 *     200:
 *      description: Delete account succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Account'
 *     500:
 *      description: Delete account failure
 */
router.delete('/:id', account.deleteAccount);

/**
 * @swagger
 *  /api/accounts/{id}:
 *   patch:
 *    summary: Update account
 *    description: Update account
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Accounts
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Account Id
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
router.patch('/:id', account.updateAccount);

/**
 * @swagger
 * /api/accounts/profilePic:
 *  post:
 *    summary: Upload profile picture
 *    description: Upload account's profile picture
 *    security:
 *    - bearerAuth: []
 *    tags:
 *      - Accounts
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              upload:
 *                type: string
 *                format: binary
 *    responses:
 *      200:
 *        description: Successfully upload profile picture
 *      500:
 *        description: Upload profile picture failure
 */
 router.post('/profilePic', Multer({storage: Multer.memoryStorage()}).single("upload"), account.uploadProfilePic);

 /**
  * @swagger
  * /api/accounts/profilePic:
  *  get:
  *    summary: Get url profile picture
  *    description: Get account's profile picture
  *    security:
  *    - bearerAuth: []
  *    tags:
  *      - Accounts
  *    responses:
  *      200:
  *        description: Successfully get profile picture
  *      500:
  *        description: Get profile picture failure
  */
  router.get('/profilePic', account.getProfilePic);

module.exports = router;