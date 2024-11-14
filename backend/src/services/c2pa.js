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

'use strict';
const { createC2pa, ManifestBuilder, SigningAlgorithm } = require('c2pa-node');
const { readFile } = require('fs/promises');
const path = require('path');
const axios = require('axios');
const logger = require('../utils/logger')('c2pa');

exports.readFromURL = async (url, mimeType) => {
	const c2pa = createC2pa({
		signer: await createLocalSigner(),
	});

	try {
		const response = await axios.get(url, {
			responseType: 'arraybuffer' // Ensure response is treated as binary data
		});

		const result = await c2pa.read({ buffer: response.data, mimeType });

		if (result) {
			const { active_manifest, manifests, validation_status } = result;
			return active_manifest;
		} else {
			return 'No claim found';
		}
	} catch (error) {
		console.error('Error reading from URL:', error.message);
		return error.message;
	}
};

exports.readFromFile = async (buffer, mimeType) => {
	const c2pa = createC2pa({
		signer: await createLocalSigner(),
	});
	try{
      const result = await c2pa.read({ buffer, mimeType });

      if (result) {
        const { active_manifest, manifests, validation_status } = result;
        return active_manifest
      } else {
		return { message: 'No claim found' };
      }
    } catch (error) {
      console.error('Error reading file:', error.message);
      return error
    }
};

exports.signingManifest = async (pngPages, mimeType, pdfTitle) => {
	logger.info('Reached signing');

	const generateC2pa = async () => {
		const signer = await createLocalSigner();
		logger.info('Created local signer');
		return createC2pa({ 
			signer: signer
		 });
	};

	const generateManifest = async () => {
		// Creating Manifest
		const manifest = new ManifestBuilder({
			claim_generator: 'scanbot/1.0.0',
			format: mimeType,
			title: pdfTitle,
			assertions: [
				{
					label: 'c2pa.actions',
					data: {
						actions: [
							{
								action: 'c2pa.created',
							},
						],
					},
				},
				{
					label: 'com.p3idtech.scanbot',
					data: {
						description: 'Scanbot assertion',
						version: '1.0.0',
					},
				},
			],
		});
		logger.info('Created manifest');
		return manifest;
	};

	const convertDataURLToBuffer = async () => {
		// Convert Data URL to Buffer
		// const buffer = Buffer.from(dataURL.split(',')[1], 'base64');
		// logger.info('Converted data URL to buffer');
		console.log(pngPages.content)
		return pngPages.content;
	};

	// Concurrently create the test signer, manifest builder, and convert data URL to buffer
	const [c2pa, manifest, buffer] = await Promise.all([
		generateC2pa(),
		generateManifest(),
		convertDataURLToBuffer(),
	]);

	// Adding an Ingredient
	const ingredientAssetFromBuffer = { buffer, mimeType };

	// Create the ingredient
	const ingredient = await c2pa.createIngredient({
		asset: ingredientAssetFromBuffer,
		title: pdfTitle,
	});
	logger.info('Created ingredient');

	// Add it to the manifest
	manifest.addIngredient(ingredient);
	logger.info('Added ingredient');

	// Signing a Manifest
	const asset = { buffer, mimeType };
	const { signedAsset, signedManifest } = await c2pa.sign({ asset, manifest });
	logger.info('PNG signed!');

	return signedAsset;
};

const createLocalSigner = async () => {
	logger.info('Creating local signer');

	const [certificate, privateKey] = await Promise.all([
		readFile(path.resolve(__dirname, '../certs/p3idtech.com.scanbot.pem')),
		readFile(path.resolve(__dirname, '../certs/tls_server.key')),
	]);

	return {
		type: 'local',
		certificate: certificate,
		privateKey: privateKey,
		algorithm: SigningAlgorithm.ES256,
		tsaUrl: 'http://timestamp.digicert.com',
	};
};
