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
 *   Job:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: Id of job
 *      example: 1
 *     accountId:
 *      type: string
 *      description: Id of account
 *      example: 8252ef79-9281-4e60-afe4-7eea71f27744
 *     name:
 *      type: string
 *      description: name of job
 *      example: This is Job 1
 *     description:
 *      type: string
 *      description: description of job
 *      example: This is description for Job 1
 *     continuousScan:
 *      type: boolean
 *      description: continuous scan of job
 *      example: false
 *     showMessage:
 *      type: boolean
 *      description: show message of job
 *      example : true
 *     message:
 *      type: string
 *      description: message of job
 *      example: This is message for Job 1
 *     showThumbnail:
 *      type: boolean
 *      description: show thumbnail of job
 *      example: true
 *     thumbnailQuality:
 *      type: number
 *      description: thumbnail of job
 *      example: 1
 *     showScanButton:
 *      type: boolean
 *      description: show scan button
 *      example: true
 *     autoLogout:
 *      type: boolean
 *      description: auto logout
 *      example: true
 *     waitFileTransfer:
 *      type: boolean
 *      description: wait file transfer
 *      example: true
 *     showTransferCompletion:
 *      type: boolean
 *      description: show transfer completion
 *      example: true
 *     fileName:
 *      type: string
 *      description: file name
 *      example: File 1
 *     fileFormat:
 *      type: number
 *      description: file format
 *      example: 1
 *     fileSeparation:
 *      type: number
 *      description: file separation
 *      example: 1
 *     fileSeparatorDiscard:
 *      type: boolean
 *      description: file separator discard
 *      example: true
 *     doubleFacesSeparation:
 *      type: boolean
 *      description: double faces separation
 *      example: true
 *     pageCount:
 *      type: number
 *      description: page count
 *      example: 10
 *     driverProfile:
 *      type: number
 *      description: driver profile
 *      example: 1
 *     linkType:
 *      type: number
 *      description: link type
 *      example: 1
 *     linkTypeId:
 *      type: number
 *      description: link type ID
 *      example: 1
 *     outputIndexFile:
 *      type: boolean
 *      description: output index file
 *      example: true
 *     indexFileName:
 *      type: string
 *      description: index file name
 *      example: index 1
 *     overwriteIndexFile:
 *      type: boolean
 *      description: overwrite index file
 *      example: false
 *     source:
 *      type: number
 *      description: source of job
 *      example: 1
 *     buttonColor:
 *      type: string
 *      description: button color
 *      example: blue
 *     profileFileId:
 *      type: string
 *      description: profile file ID
 *      example: profile 1
 *     profileData:
 *      type: string
 *      description: profile data
 *      example: This is profile data
 *     profileFileName:
 *      type: string
 *      description: profile file name
 *      example: profile 1
 *     scanSettingData:
 *      type: string
 *      description: scan setting data
 *      example: settings
 *     scanSettingFileName:
 *      type: string
 *      description: scan setting file name
 *      example: setting 1
 *     profileImageType:
 *      type: number
 *      description: profile image type
 *      example: 1
 *     blankPageMode:
 *      type: number
 *      description: blank page mode 
 *      example: 1
 *   Jobs:
 *    type: array
 *    $ref: '#/components/schemas/Job'
 */

const JobSchema = new mongoose.Schema({
        id: String,
        accountId: String,
        sessionId: String,
        name: String,
        description: String,
        continuousScan: Boolean,
        showMessage: Boolean,
        message: String,
        showThumbnail: Boolean,
        thumbnailQuality: Number,
        showScanButton: Boolean,
        autoLogout: Boolean,
        waitFileTransfer: Boolean,
        showTransferCompletion: Boolean,
        imageURI: [String],
        fileFormat: Number,
        fileSeparation: Number,
        fileSeparatorDiscard: Boolean,
        doubleFacesSeparation: Boolean,
        pageCount: Number,
        driverProfile: Number,
        linkType: Number,
        linkTypeId: Number,
        outputIndexFile: Boolean,
        indexFileName: String,
        overwriteIndexFile: Boolean,
        source: Number,
        buttonColor: String,
        profileFileId: String,  //in the dumped db , there is another table for this.... which some of the data consist of 2 column below
        profileData: mongoose.Schema.Types.Mixed, //filestream (looks like the file for scanner profile setting such as color setting or such?)
        profileFileName: String,
        scanSettingData: String, //filestream (looks like the file for scanner setting data)
        scanSettingFileName: String,
        profileImageType: Number,
        blankPageMode: Number
}, { timestamps: true })

const Job = mongoose.model(
    "Job", JobSchema
)

Job.collection.createIndex(
    {
            id: "text",
            account: "text"
    }
)

module.exports = Job;