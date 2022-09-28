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
 *   Scanner:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: Id of scanner
 *      example: 1
 *     userId:
 *      type: string
 *      description: Id user
 *      example: 1
 *     name:
 *      type: string
 *      description: name of scanner
 *      example: Scanner 1
 *     description:
 *      type: string
 *      description: description of scanner
 *      example: Scanner 1 for scan document
 *     serialNo:
 *      type: string
 *      description: serialNo of scanner
 *      example: 12345
 *     model:
 *      type: string
 *      description: model of scanner
 *      example: ScanBot Scanner
 *     macAddress:
 *      type: string
 *      description: macAddress of scanner
 *      example: 12344
 *     ipAddress:
 *      type: string
 *      description: ipAddress of scanner
 *      example: 12345678
 *     protocol:
 *      type: string
 *      description: protocol of scanner
 *      example: protocol
 *     port:
 *      type: string
 *      description: port of scanner
 *      example: 1234
 *
 *   Scanners:
 *    type: array
 *    $ref: '#/components/schemas/Scanner'
 */

const ScannerSchema = new mongoose.Schema({
        id: String,
        accountId: String,
        name: String,
        description: String,
        manufacturer: String,
        serial_number: String,
        model: String,
        macAddress: String,
        ipAddress: String,
        protocol: String,
        port: Number,
        lastActive: Date,
        deletedAt: Date,
        clientId: String,
        registrationToken: String,
        loginToken: String,
}, { timestamps: true });

const Scanner = mongoose.model(
    'Scanner', ScannerSchema
);

Scanner.collection.createIndex(
    {
        id: 'text',
        accountId: 'text',
        serialNo: 'text',
        name: 'text'
    }
);

module.exports = Scanner;
