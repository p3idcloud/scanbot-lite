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
 *   ScannerHistory:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: Id of scanner
 *      example: 1
 *     sessionId:
 *      type: string
 *      description: Session id of scanner
 *      example: 12
 *     queueId:
 *      type: string
 *      description: Queue id of scanner
 *      example: 12
 *     accountId:
 *      type: string
 *      description: Description of scanner
 *      example: 123
 *     scannerId:
 *      type: string
 *      description: Vendor of scanner
 *      example: 123
 *     name:
 *      type: string
 *      description: Value type of scanner
 *      example: Scanner 1
 *     description:
 *      type: string
 *      description: Object of scanner
 *      example: Scanning document
 *     pageCount:
 *      type: string
 *      description: Default value of scanner
 *      example: 25
 *     startDate:
 *      type: string
 *      description: Current value of scanner
 *      example: 2021-07-19
 *     status:
 *      type: array
 *      items:
 *        type: string
 *      description: Possible values of scanner
 *      example: active
 *
 *   ScannerHistories:
 *    type: array
 *    $ref: '#/components/schemas/ScannerHistory'
 */

const ScannerHistorySchema = new mongoose.Schema({
    id: String,
    sessionId: String,
    queueId: String,
    accountId: String,
    scannerId: String,
    jobId: String,
    name: String,
    description: String,
    pageCount: Number,
    startDate: String,
    status: String
}, { timestamps: true });

const ScannerHistory = mongoose.model('ScannerHistory', ScannerHistorySchema);

ScannerHistory.collection.createIndex({
    id: 'text'
});

module.exports = ScannerHistory;