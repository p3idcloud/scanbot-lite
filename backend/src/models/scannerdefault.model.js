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
 *   ScannerDefault:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: Id of ScannerDefault
 *      example: 2488e7f3-58ac-41c6-95cb-726e734895cf
 *     accountId:
 *      type: string
 *      description: accountId linked
 *      example: 19d5c616-0230-43d8-9433-f616c8446fc5
 *     userId:
 *      type: string
 *      description: userId linked
 *      example: 7f051a87-d5f0-48b4-b262-337fffd6ddfa
 *     scannerId:
 *      type: string
 *      description: The scannerId linked to user
 *      example: 6febba51-65f6-46c7-98ff-1a0ed9c591d4
 *
 *   ScannerDefaults:
 *    type: array
 *    $ref: '#/components/schemas/ScannerDefault'
 */

const ScannerDefaultSchema = new mongoose.Schema({
    id: String,
    accountId: String,
    scannerId: String
}, { timestamps: true });

const ScannerDefault = mongoose.model('ScannerDefault', ScannerDefaultSchema);

ScannerDefault.collection.createIndex(
    {
        accountId: 'text'
    });

module.exports = ScannerDefault;