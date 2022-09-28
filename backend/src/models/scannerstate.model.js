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
 *   ScannerState:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: Id of setting
 *      example: 1
 *     scannerId:
 *      type: string
 *      description: Scanner Id
 *      example: 2
 *     currentQueueId:
 *      type: string
 *      description: Queue id of the scanner state
 *      example: 3
 *     pollingUrl:
 *      type: string
 *      description: Polling url of the scanner state
 *      example: scanner/polling
 *     inviteUrl:
 *      type: string
 *      description: Invite url of the scanner state
 *      example: scanner/invite
 *     status:
 *      type: string
 *      description: Status of the scanner state
 *      example: active
 *     xPrivetToken:
 *      type: string
 *      description: Private token
 *      example: token-aaa-yyy
 *     sessionId:
 *      type: string
 *      description: Session id of scanner
 *      example: 123
 *     latestEvent:
 *      type: array
 *      items:
 *        type: string
 *      description: Latest event
 *      example: convert
 *   ScannerStates:
 *    type: array
 *    $ref: '#/components/schemas/ScannerState'
 */

const ScannerStateSchema = new mongoose.Schema({
    id: String,
    scannerId: String,
    currentQueueId: String,
    currentlyUsedByUserId: String,
    pollingUrl: String,
    inviteUrl: String,
    state: String,
    status: String,
    xPrivetToken: String,
    sessionId: String,
    latestEvent: String,
    imageUrl: [String],
    lastCommandAt: Date
}, { timestamps: true });

const ScannerState = mongoose.model('ScannerState', ScannerStateSchema);

ScannerState.collection.createIndex({
    id: 'text'
});

module.exports = ScannerState;