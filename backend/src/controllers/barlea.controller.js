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
const pluginService = require('../services/plugin');
const NodeCache = require('node-cache');
const { mergePdf, streamToBlob, streamlinePdfBlobList } = require('../utils/helpers');
const ScannerHistoryService = require('../services/scannerhistory');
const { getGlobalMinioClient } = require('../lib/minio.lib');

/**
 * Execute callback to handle PDF upload
 */
const sendBarlea = async (req, res) => {
    if (!req.body.pdfUrls) {
        return res.status(400).json({
            message: "No PDF Urls specified" 
        });
    }
    const accountID = req.twain.principalId;

    const barleaPlugin = await getBarleaPlugin(accountID)
    const apiToken = await getApiToken(barleaPlugin)
    if (apiToken == null) {
        return res.status(401).json({
            message: "Failed to get barlea api token" 
        });
    }

    // Fetch and process PDF blobs
    const pdfBlobList = await fetchPdfBlobs(req.body.pdfUrls, accountID);
    if (pdfBlobList.includes(null)) {
        return res.status(500).json({ "message": "Failed to retrieve some PDFs" });
    }

    const [mergedPdf, error] = await mergePdf(streamlinePdfBlobList(pdfBlobList));
    console.log(mergedPdf)
    if (error) {
        console.log("Failed to merge Pdf");
        return res.status(500).json({ "message": "Failed to merge Pdf" });
    }

    const resultHash = await uploadDocumentMultipart(barleaPlugin, apiToken, req.body.pdfTitle, mergedPdf);
    const result = await addDocumentMetadata(barleaPlugin, apiToken, resultHash, mergePdf, req.body.historyId);
    if (result instanceof Error) {
        res.status(500).json({
            message: `Failed to send document metadata: ${result.message}`
        })
    } else {
        res.json({
            message: "Document & Metadata sent successfully to Barlea",
            data: result.data 
        })
    }
};

const getBarleaPlugin = async (accountID) => {
    const plugin = await pluginService.getPluginFromName("BARLEA", accountID);

    return plugin;
}

const getApiToken = async (plugin) => {
    try {
        const response = await axios.post(`${plugin.data.endpoint}/v1/auth/login`, {
            username: plugin.data.username,
            password: plugin.data.password,
        });
        return response.data.token;;
    } catch (error) {
        console.log(error)
        return null;
    }
};

/**
 * Upload document to Barlea API
 */

const uploadDocumentMultipart = async (plugin, token, title, pdfBlob ) => {
    try {
        const fileName = title
        const form = new FormData();

        // Append the necessary form fields
        form.append('file', pdfBlob, fileName);

        // Send multipart form-data request to the API
        const response = await axios.post(`${plugin.data.endpoint}/v1/company/document/hash?subjectId=${plugin.data.subject_id}`, form, {
            headers: {
                Authorization: `Bearer ${token}`
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
const addDocumentMetadata = async (plugin, token, resultHash, pdfBlob, historyId) => {
    try {
        const history = await ScannerHistoryService.getScannerHistoryFromId(historyId)
        const requestBody = {
            accessControls: "",
            created: new Date(history.createdAt).toISOString().split('T')[0],
            createdBy: plugin.data.source_id,
            documentSize: pdfBlob.size,
            fileName: history.name,
            fileType: history.name,
            hash: resultHash.data,
            location: history.queueId,
            modifiedBy: "",
            name: history.name,
            published: new Date(history.startDate).toISOString().split('T')[0],
            purpose: "SCANBOT-BARLEA",
            sourceId: plugin.data.source_id,
            subjectId: plugin.data.subject_id,
        };

        const response = await axios.post(`${plugin.data.endpoint}/v1/company/document`, requestBody, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response;
    } catch (e) {
        console.error(e);
        return e;
    }
};

module.exports = {
    sendBarlea
}