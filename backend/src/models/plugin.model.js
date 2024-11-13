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
 *   Plugin:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: Id of plugin
 *      example: 1
 *     name:
 *      type: string
 *      description: Name of plugin
 *      example: Plugin 1
 *     data:
 *      type: object
 *      description: data of a plugin
 *      example: { client_id: "", client_secret: "" }
 *     enabled:
 *      type: boolean
 *      description: Enable Plugin Function
 *      example: true
 *   Plugins:
 *    type: array
 *    $ref: '#/components/schemas/Plugin'
 */

const PluginSchema = new mongoose.Schema({
    id: String,
    name: String,
    data: Object,
    enabled: Boolean,
    accountID: String,
}, { timestamps: true })

const Plugin = mongoose.model(
"Plugin", PluginSchema
)

Plugin.collection.createIndex(
{
    id: "text",
    name: 'text',
}
)

module.exports = Plugin;