'use strict';
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *  schemas:
 *   Account:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: Id of account
 *      example: 1
 *     name:
 *      type: string
 *      description: Name of account
 *      example: Account 1
 *     description:
 *      type: string
 *      description: Description of account
 *      example: This is Account 1
 *
 *   Accounts:
 *    type: array
 *    $ref: '#/components/schemas/Account'
 */

const AccountSchema = new mongoose.Schema({
        id: String,
        username: String,
        email: String,
        password: String,
        fullname: String,
        profPicURI: String,
        lastActive: Date,
}, { timestamps: true })

const Account = mongoose.model(
    "Account", AccountSchema
)

Account.collection.createIndex(
    {
        id: "text",
        username: 'text',
        fullname: 'text',
        email: 'text'
    }
)

module.exports = Account;