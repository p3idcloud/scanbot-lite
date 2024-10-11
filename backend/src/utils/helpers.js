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

const PDFMerger = require("pdf-merger-js");
const { Readable } = require('stream');

exports.mergePdfToBase64 = async (blobs) => {
    try {
        const merger = new PDFMerger();
        for await (const blob of blobs) {
            var _blob;
            if (blob instanceof Blob) {
                _blob = Buffer.from(await blob.arrayBuffer());
            } else {
                _blob = blob;
            }
            await merger.add(_blob);
        }
        const mergedPdf = (await merger.saveAsBuffer()).toString('base64');
        return [mergedPdf, null];
    } catch (error) {
        console.log(error);
        return [null, error];
    }
};

exports.mergePdf = async (blobs) => {
    try {
        const merger = new PDFMerger();
        for await (const blob of blobs) {
            var _blob;
            if (blob instanceof Blob) {
                _blob = Buffer.from(await blob.arrayBuffer());
            } else {
                _blob = blob;
            }
            await merger.add(_blob);
        }
        const mergedPdf = new Blob([new Uint8Array(await merger.saveAsBuffer())], {
            type: 'application/pdf'
        });
        return [mergedPdf, null];
    } catch (error) {
        console.log(error);
        return [null, error];
    }
};

exports.streamlinePdfBlobList = (pdfBlobParam) => {
    if (Array.isArray(pdfBlobParam)) {
        return pdfBlobParam.map(pdfBlob => {
            if (pdfBlob instanceof Blob) {
                return pdfBlob;
            } else {
                // Type text/string
                const blob = new Blob([pdfBlob], {
                    type: 'application/pdf'
                });
                return blob;
            }
        });
    } else {
        return pdfBlobParam;
    }
}

exports.streamToBlob = async (readableStream, { mimeType = null } = { mimeType: null }) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', (chunk) => {
            chunks.push(chunk);
        });

        readableStream.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve(new Blob([buffer], { type: mimeType || 'application/pdf' }));
        });

        readableStream.on('error', (error) => {
            reject(error);
        });
    });
}


exports.findFilename= (url) => {
    try {
      const urlParts = url?.split("/");
      const scannerId = urlParts[urlParts?.length - 2];
      const fileId = urlParts[urlParts?.length - 1].split("?")[0];
  
      return { scannerId, fileId };
    } catch {
      return { scannerId: 0, fileId: 0 };
    }
  }
