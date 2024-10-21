/*
 * Copyright (C) 2016-2024 P3iD Technologies Inc. (http://p3idtech.com)
 * license[at]p3idtech[dot]com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { default: axios } = require('axios');
const { Plugin } = require('../');
const NodeCache = require('node-cache');
const cache = new NodeCache();

/**
 * Args Definition
 */
class BarleaArgs {
    pdfBlob = null; // Blob or Array<Blob>
    detailHistory = null;
    barleaEndpoint = null; // Barlea API Endpoint (e.g., https://api.barlea.com)
    username = null; // This can be any user
    password = null; // String
    apiToken = null; // String
    sourceId = null; // This needs to be of user with Creator role
    subjectId = null; // This needs to be of user with Subject role
    accountId = null; // String
}

/**
 * Class Definition
 */
class BarleaPlugin extends Plugin {
    static name = 'Barlea';
    static description = 'Plugin used to interact with Barlea API';
    static pluginPath = __filename;
    static apiRoute = '/workflow-plugins/barlea/upload';
    static formTitle = 'Upload to Barlea';
    static showForm = true;
    static formFields = [
        {
            id: 'barlea_endpoint',
            policyName: 'Barlea Endpoint',
            policyDesc: 'Barlea API endpoint URL',
            name: 'barleaEndpoint',
            type: 'string',
            inputType: 'text',
            placeHolder: 'Enter Barlea API endpoint URL'
        },
        {
            id: 'barlea_username',
            policyName: 'Barlea Username',
            policyDesc: 'Barlea Username',
            name: 'username',
            type: 'string',
            inputType: 'text',
            placeHolder: 'Enter your Barlea username'
        },
        {
            id: 'barlea_password',
            policyName: 'Barlea Password',
            policyDesc: 'Barlea Password',
            name: 'password',
            type: 'password',
            inputType: 'text',
            placeHolder: 'Enter your Barlea password'
        },
        {
            id: 'barlea_sourceId',
            policyName: 'Barlea Source ID',
            policyDesc: 'Barlea Source ID',
            name: 'sourceId',
            type: 'string',
            inputType: 'text',
            placeHolder: 'Enter the agentId of a user with Creator role'
        },
        {
            id: 'barlea_subjectId',
            policyName: 'Barlea Subject ID',
            policyDesc: 'Barlea Subject ID',
            name: 'subjectId',
            type: 'string',
            inputType: 'text',
            placeHolder: 'Enter the agentId of a user with Subject role'
        },
    ];

    args = new BarleaArgs();

    constructor({ barleaEndpoint, username, password, apiToken, pdfBlob, detailHistory, sourceId, subjectId, accountId = '' } = {}) {
        super();
        this.args.barleaEndpoint = barleaEndpoint;
        this.args.username = username;
        this.args.password = password;
        this.args.pdfBlob = pdfBlob;
        this.args.sourceId = sourceId;
        this.args.subjectId = subjectId;
        if (typeof detailHistory === 'string') {
            this.args.detailHistory = JSON.parse(detailHistory); // Parse if it's a string
        } else {
            this.args.detailHistory = detailHistory; // Already an object, no need to parse
        }

        if (!apiToken) {
            this.args.apiToken = cache.get(`barleaApiToken_${accountId}`);
            if (!this.args.apiToken) {
                this.getApiToken();
            }
        }

        if (!this.args.apiToken) {
            return this.getApiToken().then(() => this);
        }
    }

    /**
     * Fetch API token from Barlea
     */
    getApiToken = async () => {
        try {
            const response = await axios.post(`${this.args.barleaEndpoint}/v1/auth/login`, {
                username: this.args.username,
                password: this.args.password,
            });
            this.args.apiToken = response.data.token; // Assuming the token is returned as 'token'
            cache.set(`barleaApiToken_${this.args.accountId}`, this.args.apiToken, 600); // Cache the token for 10 minutes
            return response;
        } catch (error) {
            return error;
        }
    };

    /**
     * Upload document to Barlea API
     */

    uploadDocumentMultipart = async () => {
        try {
            const fileName = this.args.detailHistory?.history?.name
            const form = new FormData();

            // Append the necessary form fields
            form.append('file', this.args.pdfBlob, fileName);

            // Send multipart form-data request to the API
            const response = await axios.post(`${this.args.barleaEndpoint}/v1/company/document/hash?subjectId=${this.args.subjectId}`, form, {
                headers: {
                    Authorization: `Bearer ${this.args.apiToken}`
                },
                maxBodyLength: Infinity, // Handle large files
                maxContentLength: Infinity
            });

            return response;
        } catch (e) {
            console.error(e);
            return e;
        }
    };

    /**
     * Add uploaded document metadata to Barlea API
     */
    addDocumentMetadata = async (resultHash) => {
        try {
            const arrayBuffer = await this.args.pdfBlob.arrayBuffer();
            const fileBuffer = Buffer.from(arrayBuffer);
            const documentSize = this.args.pdfBlob.size || fileBuffer.length;

            const requestBody = {
                accessControls: "",
                created: new Date(this.args.detailHistory?.history?.createdAt).toISOString().split('T')[0],
                createdBy: this.args.sourceId,
                documentSize: documentSize,
                fileName: this.args.detailHistory?.history?.name,
                fileType: this.args.detailHistory?.history?.name,
                hash: resultHash.data,
                location: this.args.detailHistory?.history?.queueId,
                modifiedBy: "",
                name: this.args.detailHistory?.history?.name,
                published: new Date(this.args.detailHistory?.history?.startDate).toISOString().split('T')[0],
                purpose: "SCANBOT-BARLEA",
                sourceId: this.args.sourceId,
                subjectId: this.args.subjectId,
            };

            const response = await axios.post(`${this.args.barleaEndpoint}/v1/company/document`, requestBody, {
                headers: {
                    Authorization: `Bearer ${this.args.apiToken}`,
                    'Content-Type': 'application/json'
                }
            });

            return response;
        } catch (e) {
            console.error(e);
            return e;
        }
    };

    /**
     * Execute callback to handle PDF upload
     */
    executeCallback = async () => {
        if (!this.args.pdfBlob) {
            return { status: 400, message: "No PDF Blob specified" };
        }

        const resultHash = await this.uploadDocumentMultipart();
        const result = await this.addDocumentMetadata(resultHash);
        if (result instanceof Error) {
            return { status: 500, message: `Failed to send document metadata: ${result.message}` };
        } else {
            return { status: 200, message: "Document & Metadata sent successfully to Barlea", data: result.data };
        }
    };
}

module.exports = BarleaPlugin;
