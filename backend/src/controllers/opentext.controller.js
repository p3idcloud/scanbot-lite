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
const cache = new NodeCache();
const { mergePdfToBase64, streamlinePdfBlobList, streamToBlob } = require('../utils/helpers');
const { getGlobalMinioClient } = require('../lib/minio.lib')
const OpentextService = require('../services/opentext');
const { Blob } = require('buffer'); 
const { generateOpentextURL } = require('../utils/opentextURL');
const TokenExpiredError = require('jsonwebtoken/lib/TokenExpiredError');

// exports.executeCallback = async (req, res) => {
//     // Generate request body for multiple file blobs or urls
//     let pdfAttachmentBlob = null;
//     if (Array.isArray(this.args.pdfBlob)) {
//         // Convert text data to blob if text
//         this.args.pdfBlob = streamlinePdfBlobList(this.args.pdfBlob);

//         // Merge
//         const [mergedPdfBlobs, error] = await mergePdf(this.args.pdfBlob);
//         if (error)  {
//             console.log("Failed to merge Pdf")
//             return {"status": 500, "message": "Failed to merge Pdf"};
//         }
//         pdfAttachmentBlob = mergedPdfBlobs;
//     } else if (this.args.pdfBlob) {
//         pdfAttachmentBlob = this.args.pdfBlob;
//     } else {
//         return { "status": 400, "message": "No Pdf Specified" };
//     }

//     const openTextResult = await this.putPdf(pdfAttachmentBlob);
//     if (openTextResult instanceof Error) {
//         return { "status": 500, "message": `Something went wrong with Opentext:\n${openTextResult.message}` };
//     } else {
//         return { 
//             "status": 200,
//             "message": `Pdf successfully uploaded to Riskguard`,
//             "data": openTextResult.data
//         };
//     }
// }

exports.sendOCR = async (req, res) => {
    try {
        if (!req.body.pdfUrls) {
            return res.status(400).json({ "message": "No PDF Url Specified" });
        }
        
        const accountID = req.twain.principalId;
        const minioClient = getGlobalMinioClient();
        let pdfBlobList = [];

        const urls = req.body.pdfUrls;

        pdfBlobList = await Promise.all(urls.map(async (url) => {
            if (url.includes(process.env.BASE_URL)) {
                let uri = url.replace(`${process.env.BASE_URL}api/storage/`, '').split('?')[0];
                let pdfStream = await minioClient.getObject(accountID, uri);
                try {
                    return await streamToBlob(pdfStream);
                } catch (e) {
                    console.error(`Error converting stream to blob: ${e}`);
                    return null;
                }
            } else {
                try {
                    const response = await fetch(url);
                    return await response.blob();
                } catch (err) {
                    console.error(`Error fetching URL: ${url}, error: ${err}`);
                    return null;
                }
            }
        }));

        if (pdfBlobList.includes(null)) {
            return res.status(500).json({ "message": "Failed to retrieve some PDFs" });
        }

        pdfBlobList = streamlinePdfBlobList(pdfBlobList);
        const [mergedPdf, error] = await mergePdfToBase64(pdfBlobList);
        if (error) {
            console.log("Failed to merge Pdf");
            return res.status(500).json({ "message": "Failed to merge Pdf" });
        }

        const opentextPlugin = await getOpentextPlugin(accountID);
        const token = await getToken(opentextPlugin, accountID);
        const sessionOCR = await createSessionOCR(token, opentextPlugin);
        const uploadOCRResult = await putPdfOCR(mergedPdf, token, opentextPlugin);

        if (uploadOCRResult instanceof Error) {
            return res.status(500).json({ "message": `Something went wrong with Opentext: ${uploadOCRResult.message}` });
        }

        const OCRResult = await requestOCR(uploadOCRResult, req.body.pdfTitle, token, opentextPlugin);
        if (OCRResult instanceof Error) {
            return res.status(500).json({ "message": `Something went wrong with Opentext: ${OCRResult}` });
        }

        // Process OCR results
        for (const result of OCRResult.resultItems) {
            const type = result.nodeId === 1 ? "text" : "pdf";
            getFileOCRResult(result.files[0].value, type,accountID, req.body.historyId, token, opentextPlugin)
        }

        return res.status(200).json({ "message": "Pdf successfully uploaded to OCR" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
}

exports.getAccessToken = async (req, res) => {
    try {
        const plugin = await getOpentextPlugin(req.twain.principalId);
        const data = await axios.post(`${plugin.data.domain}/tenants/${plugin.data.tenantId}/oauth2/token`, {
            "client_id": plugin.data.clientId,
            "client_secret": plugin.data.clientSecret,
            "grant_type": "client_credentials"
        });
        cache.set(`opentextAccessToken_${req.twain.principalId}`, data.data.access_token, 600);
        return res.status(200).json(data.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Failed to get access token" });
    }
}

exports.verifyToken = async (req, res) => {
    const { opentextDomain } = generateOpentextURL(req.body.opentext_url)
    
    try {
        var response =  await axios.post(`${opentextDomain}/tenants/${req.body.tenant_id}/oauth2/token`, {
            "client_id": req.body.client_id,
            "client_secret": req.body.client_secret,
            "grant_type": "client_credentials"
        })
        res.status(200).json(response.data)
        return response.data;
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }
}

exports.verifyTokenPlugin = async (req, res) => {
    const plugin = await getOpentextPlugin(req.twain.principalId)
    if (!plugin) {
        res.status(401).json({
            "message": "Plugin opentext not configured"
        })
    }
    const { opentextDomain } = generateOpentextURL(plugin.data.opentext_url)
    
    try {
        var response =  await axios.post(`${opentextDomain}/tenants/${plugin.data.tenant_id}/oauth2/token`, {
            "client_id": plugin.data.client_id,
            "client_secret": plugin.data.client_secret,
            "grant_type": "client_credentials"
        })
        res.status(200).json(response.data)
        return response.data;
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }
}

exports.FindOCRResult = async (req, res) => {
    const id = req.params.id;
    const accountID = req.twain.principalId;
    const result = await OpentextService.findOne(id);

    if (!result) {
        return res.status(404).json({
            "data": null,
            "message": "not_found"
        })
    }

    if (result.accountId === accountID) {
        return res.status(200).json(result)
    } else {
        return res.status(404).json({
            "data": null,
            "message": "not_found"
        })
    }
}

getOpentextPlugin = async (accountID) => {
    const plugin = await pluginService.getPluginFromName("OPENTEXT", accountID);

    return plugin;
}

getToken = async (plugin,accountID) => {
    const { opentextDomain } = generateOpentextURL(plugin.data.opentext_url)
    try {
        const data = await axios.post(`${opentextDomain}/tenants/${plugin.data.tenant_id}/oauth2/token`, {
            "client_id": plugin.data.client_id,
            "client_secret": plugin.data.client_secret,
            "grant_type": "client_credentials"
        });
        cache.set(`opentextAccessToken_${accountID}`, data.data.access_token, 600);
        return data.data.access_token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

createSessionOCR = async (token, plugin) => {
    const { opentextDomain } = generateOpentextURL(plugin.data.opentext_url)
    try{
        const response = await axios.get(`${opentextDomain}/capture/cp-rest/v2/session`,{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response;
    } catch(e) {
        console.log(e);
        return e;
    }
}

deleteSessionOCR = async (token, plugin) => {
    const { opentextDomain } = generateOpentextURL(plugin.data.opentext_url)

    try{
        const response = await axios.delete(`${opentextDomain}/capture/cp-rest/v2/session`,{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return response;
    } catch(e) {
        console.log(e);
        return e;
    }
}

putPdfOCR = async (base64Pdf, token, plugin) => {
    try {
        const { opentextDomain } = generateOpentextURL(plugin.data.opentext_url)
        const jsonData = {
        contentType: "application/pdf",
        data: base64Pdf,
        offset: 0
        };
    
        const response = await axios.post(
        `${opentextDomain}/capture/cp-rest/v2/session/files`, 
        jsonData,
        {
            headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
            }
        }
        );
    
        return response.data;
    } catch (error) {
        return error;
    }
}

requestOCR = async(file, title, token, plugin) => {
    const { opentextDomain } = generateOpentextURL(plugin.data.opentext_url)

    const requestData = {
    serviceProps: [
        {
        name: "OcrEngineName",
        value: "Advanced"
        },
        {
        name: "ProcessingMode",
        value: "VoteOcrAndEText"
        }
    ],
    requestItems: [
        {
            nodeId: 0,
            values: [
                {
                    "name": "OutputType",
                    "value": "Pdf"
                },
                {
                    "name": "Version",
                    "value": "Pdf"
                },
                {
                    "name": "Compression",
                    "value": "None"
                },
                {
                    "name": "ImageSelection",
                    "value": "OriginalImage"
                }
            ],
            files: [
                {
                    name: title,
                    value: file.id,  // From results.id
                    contentType: file.contentType,               // From results.contentType
                    fileType: "pdf"
                }
            ]
        },
        {
            nodeId: 1,
            values: [
                {
                    "name": "OutputType",
                    "value": "Text"
                }
            ],
            files: [
                {
                    name: title,
                    value: file.id,  // From results.id
                    contentType: file.contentType,               // From results.contentType
                    fileType: "pdf"
                }
            ]
        }
    ]
    };

    // Define the POST request
    try {
        const response = await axios.post(
        `${opentextDomain}/capture/cp-rest/v2/session/services/fullpageocr`,
        requestData,
        {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
            }
        );
        return response.data
    } catch (error) {
        console.error('Error sending OCR request:', error.response ? error.response.data : error.message);
        return error
    }

}

getFileOCRResult = async (id,type, accountID, historyID, token, plugin) => {
    const { opentextDomain } = generateOpentextURL(plugin.data.opentext_url)

    var contentType = "application/pdf"
    if (type === "text") {
        contentType = "plain/text"
    }

    try{
        const response = await axios.get(`${opentextDomain}/capture/cp-rest/v2/session/files/${id}`,{
            headers: {
                "Authorization": `Bearer ${token}`
            },
            responseType: 'arraybuffer'
        })
        const minioClient = getGlobalMinioClient();
        var savedURL = `opentext/${id}`
        const fileBuffer = Buffer.from(response.data); // Get the file as a Buffer
        const blob = new Blob([fileBuffer], { type: response.headers['content-type'] }); 

        minioClient.putObject(accountID, savedURL, fileBuffer, { 'Content-Type': contentType})
        var ot = {
            accountId: accountID,
            scannerHistoryId: historyID,
        }
        if (type === "text") {
            ot.OcrText = savedURL
        } else {
            ot.OcrPDF = savedURL
        }
        const res = OpentextService.updateOpentext(historyID, ot)

        if (contentType === "plain/text") {
            new Promise((resolve, reject) => {
                putPdf(blob, token, plugin, historyID)
                    .then(resolve)
                    .catch(reject);
                });
        }

        return res;
    } catch(e) {
        console.log(e);
        return e;
    }
}


putPdf = async (pdfBlob, token, plugin, historyID) => {
    const { opentextDomain } = generateOpentextURL(plugin.data.opentext_url)

    try{
        let form = new FormData();
        form.append('File', pdfBlob);
        const response = await axios.post(`${opentextDomain}/mtm-riskguard/api/v1/process`, form,{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        
        const res = OpentextService.updateOpentext(historyID, {
            Riskguard: response.data.results
        })

        return response;
    } catch(e) {
        console.log(e);
        return e;
    }
}

