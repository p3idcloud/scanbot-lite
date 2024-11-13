/*
 * Copyright (C) 2016-2024 P3iD Technologies Inc. (https://p3idtech.com)
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

const { PDFDocument } = require('pdf-lib');
const { createCanvas } = require('canvas');

exports.separatePagesToPDFs = async ({ file }) => {
    const { buffer: pdfBuffer, originalname } = file;

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();

    const copyPromises = Array.from({ length: pageCount }, async (_, i) => {
        const newPDF = await PDFDocument.create();
        const [copiedPage] = await newPDF.copyPages(pdfDoc, [i]);
        newPDF.addPage(copiedPage);
        const newPDFBytes = await newPDF.save();
        return { page: i + 1, pdfBytes: newPDFBytes };
    });

    const newPDFs = await Promise.all(copyPromises);
    newPDFs.sort((a, b) => a.page - b.page);

    return newPDFs.map(({ page, pdfBytes }) => Buffer.from(pdfBytes));
}

exports.convertPdfToPng = async ({ file }) => {
    try {
        const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const { buffer: pdfBuffer, originalname } = file;
        const uint8Array = new Uint8Array(pdfBuffer);
        const pdf = await getDocument({ data: uint8Array }).promise;
        const totalPageCount = pdf.numPages;

        const images = [];
        for (let i = 1; i <= totalPageCount; i++) {
            const page = await pdf.getPage(i);

            // Set up a canvas
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext('2d');

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            await page.render(renderContext).promise;

            // Convert canvas to PNG image
            const dataURL = canvas.toDataURL('image/png');
            images.push(dataURL);
        }

        return images[0]
    } catch (error) {
        console.error('Error converting PDF to PNG:', error);
        return null;
    }
}
