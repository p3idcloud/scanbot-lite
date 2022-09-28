'use strict';
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *  schemas:
 *   ProfileDefinition:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: Id of profile
 *      example: 1
 *     userID:
 *      type: string
 *      description: User id of profile
 *      example: 12345
 *     accountId:
 *      type: string
 *      description: Account id of profile
 *      example: 12345
 *     name:
 *      type: string
 *      description: Name of profile
 *      example: Standarized
 *     policies:
 *      type: object
 *      description: Policies of profile
 *      example: {NumberOfSheets: maximum}
 *
 *   ProfileDefinitions:
 *    type: array
 *    $ref: '#/components/schemas/ProfileDefinition'
 */
const ProfileDefinitionSchema = new mongoose.Schema({
    id: String,
    accountId: String,
    name: String,
    scannerSettings: Array
}, { timestamps: true });

const ProfileDefinition = mongoose.model('ProfileDefinition', ProfileDefinitionSchema);

ProfileDefinition.collection.createIndex({
        id: 'text',
        accountId: 'text',
        name: 'text'
    });

module.exports = ProfileDefinition;
