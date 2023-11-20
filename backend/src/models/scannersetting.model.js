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
 *   ScannerSetting:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: Id of setting
 *      example: 1
 *     labelname:
 *      type: string
 *      description: Labelname of setting
 *      example: Color
 *     description:
 *      type: string
 *      description: Description of setting
 *      example: The colorspace and the bit depth of a pixel.
 *     vendor:
 *      type: string
 *      description: Vendor of setting
 *      example: Vendor
 *     valuetype:
 *      type: string
 *      description: Value type of setting
 *      example: String
 *     object:
 *      type: string
 *      description: Object of setting
 *      example: task.actions[]
 *     defaultvalue:
 *      type: string
 *      description: Default value of setting
 *      example: default
 *     currentvalue:
 *      type: string
 *      description: Current value of setting
 *      example: default
 *     attributeName:
 *      type: string
 *      description: Attribute value for setting
 *      example: color
 *     possiblevalues:
 *      type: array
 *      items:
 *        type: string
 *      description: Possible values of setting
 *      example: [
 *          {label: default, value: any}
 *      ]
 *   ScannerSettings:
 *    type: array
 *    $ref: '#/components/schemas/ScannerSetting'
 */
const ScannerSettingSchema = new mongoose.Schema({
    id: String,
    labelName: String,
    description: String,
    vendor: String,
    valueType: String,
    object: String,
    defaultValue: String,
    currentValue: String,
    attributeName: String,
    configurationType: String,
    possibleValues: Array
}, { timestamps: true });

const ScannerSetting = mongoose.model('ScannerSetting', ScannerSettingSchema);

ScannerSetting.collection.createIndex({
    id: 'text'
});

module.exports = ScannerSetting;