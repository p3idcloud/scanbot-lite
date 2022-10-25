const { Client } = require('minio');
const PDFMerger = require('pdf-merger-js');

async function mergePDFFromImageURIs(accountId, imageURIs) {
  try {
    const minioClient = new Client({
      endPoint: process.env.AWS_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT, 10),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SECRET_KEY,
    });

    const streamToBuffer = async function (stream) {
      return new Promise((resolve, reject) => {
        const data = [];

        stream.on('data', (chunk) => data.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(data)));
        stream.on('error', (err) => reject(err));
      });
    }

    const merger = new PDFMerger();

    for await (const image of imageURIs) {
      const stream = await minioClient.getObject(accountId, image);
      const buffer = await streamToBuffer(stream);
      merger.add(buffer);
    }

    const mergedPdf = await merger.saveAsBuffer();
    return [mergedPdf, null];
  } catch (error) {
    return [null, error];
  }
}

module.exports = { mergePDFFromImageURIs };
