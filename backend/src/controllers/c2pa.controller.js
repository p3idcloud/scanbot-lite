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

'use strict';
const c2paserv = require("../services/c2pa")
const { getGlobalMinioClient, putObjectBuffer } = require("../lib/minio.lib");
const { streamToBlob } = require("../utils/helpers");
const { convertPdfToPng } = require("../lib/pdf.lib");
const logger = require('../utils/logger')('c2paClient');
const fs = require('fs');

const generatePngUrl = (uri) => uri + '-c2pa-png.png';

const retrieveC2paPng = async (accountId, uri) => {
	const pngUrl = generatePngUrl(uri);
	const minioClient = getGlobalMinioClient();
	try {
		let pdfStream = await minioClient.getObject(accountId, pngUrl);
		return await streamToBlob(pdfStream, { mimeType: 'image/png' });
	} catch (e) {
		return null;
	}
}

const storeC2paPng = async (accountId, uri, buffer) => {
	const pngUrl = generatePngUrl(uri);
	const paths = pngUrl.split('/');
	const filename = paths[paths.length-1]
	await putObjectBuffer(accountId, pngUrl, buffer, filename);
	logger.info(`stored: ${pngUrl}`);
}

const storeC2pa = async (accountId, uri, buffer) => {
	const storeUrl = uri + '-c2pa'
	const paths = storeUrl.split('/');
	const filename = paths[paths.length-1]
	await putObjectBuffer(accountId, storeUrl, buffer, filename);
	logger.info(`stored: ${storeUrl}`);
}


const retrieveC2pa = async (accountId, uri) => {
	const minioClient = getGlobalMinioClient();
	try {
		let pdfStream = await minioClient.getObject(accountId, uri);
		return await streamToBlob(pdfStream);
	} catch (e) {
		return null;
	}
}

const retrieveFile = async (accountId, uri) => {
	const minioClient = getGlobalMinioClient();
	try {
		let pdfStream = await minioClient.getObject(accountId, uri);
		return await streamToBlob(pdfStream);
	} catch (e) {
		console.log(e)
		return null;
	}
}

const retrieveC2paPdf = async (accountId, uri) => {
	const minioClient = getGlobalMinioClient();
	try {
		let pdfStream = await minioClient.getObject(accountId, uri);
		return await streamToBlob(pdfStream);
	} catch (e) {
		console.log(e)
		return null;
	}
}


const c2paReadFile = async (req, res) => {
	const fileUpload = req.file;
	const fileContent = req.body;
	logger.info(fileUpload)
	try {
	  const buffer = fileUpload.buffer;
	  const mimeType = fileUpload.mimetype;
	  const result = await c2paserv.readFromFile(buffer, mimeType);
	  res.json(result);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Internal Server Error' });
	}
  };

const c2paSigningManifest = async (req, res) => {
	try {
	  let { uri, pdfTitle } = req.body;
	  const c2paResult = await retrieveC2paPng(req.twain.principalId, uri);

	  if (!c2paResult) {
		const mimeType = 'image/png';
		const pdfFile = await retrieveFile(req.twain.principalId, uri);
		const buffer = Buffer.from(await pdfFile.arrayBuffer());
  
		const file = {
		  buffer,
		  mimeType: pdfFile.type,
		};
  
		const pngDataUrl = await convertPdfToPng({ file });
		if (!pngDataUrl) {
			return res.status(500).send({ message: "Failed to convert to png" })
		}
		const result = await c2paserv.signingManifest(pngDataUrl, mimeType, pdfTitle);

		// Store in MinIO
		if (result?.buffer) {
		  await storeC2paPng(req.twain.principalId, uri, result.buffer);
		}
		const imageBuffer = result.buffer;
		// Set the appropriate response headers
		res.setHeader('Content-Type', file.mimeType);
		res.setHeader('Content-Length', imageBuffer.length);
  
		return res.status(200).send(imageBuffer);
	  } else {
		// Handle the case when `c2paResult` is available
		const arrayBuffer = await c2paResult.arrayBuffer();
		const imageBuffer = Buffer.from(arrayBuffer);

		// Set the appropriate response headers
		res.setHeader('Content-Type', 'image/png'); // Default to 'image/png'
		res.setHeader('Content-Length', imageBuffer.length);
		return res.status(200).send(imageBuffer);
	  }
	  
	} catch (error) {
	  console.error('Error in c2paSigningManifest:', error);
	  return res.status(500).send('Internal Server Error');
	}
  };

module.exports = {
	generatePngUrl,
	retrieveC2paPng,
	retrieveC2paPdf,
	retrieveC2pa,
	retrieveFile,
	storeC2paPng,
	storeC2pa,
	c2paReadFile,
	c2paSigningManifest
}