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
 *   ApiKeys:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: Id
 *      example: 1
 *     name:
 *      type: string
 *      description: name of the api key
 *      example: exampleName
 *     userId:
 *      type: string
 *      description: User ID
 *      example: 1
 *     key:
 *      type: string
 *      description: API Key
 *      example: randomizedkey
 *     secret:
 *      type: string
 *      description: API Secret
 *      example: randomizedsecret
 *
 *   Accounts:
 *    type: array
 *    $ref: '#/components/schemas/ApiKeys'
 */

const ApiKeysSchema = new mongoose.Schema({
  id: String,
  name: String,
  userId: String,
  accountId: String,
  key: String,
  secret: String,
}, { timestamps: true })

const ApiKeys = mongoose.model(
  "ApiKeys", ApiKeysSchema
)

ApiKeys.collection.createIndex(
  {
    id: "text",
  }
)

module.exports = ApiKeys;
