const Minio = require('minio');
const PDFMerger = require('pdf-merger-js');

async function mergePDFFromURIs(accountId, imageURIs) {
  try {
    const minioClient = new Minio.Client({
      endPoint: process.env.AWS_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT, 10),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SECRET_KEY,
    });

    const dataStreamToBuffer = function (stream) {
      return new Promise((resolve, reject) => {
        const _buf = [];

        stream.on('data', (chunk) => _buf.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(_buf)));
        stream.on('error', (err) => reject(err));
      });
    }

    const merger = new PDFMerger();

    for await (const image of imageURIs) {
      const stream = await minioClient.getObject(accountId, image);
      const buffer = await dataStreamToBuffer(stream);
      merger.add(buffer);
    }

    const mergedPdf = await merger.saveAsBuffer();
    return [mergedPdf, null];
  } catch (error) {
    return [null, error];
  }
}

module.exports = { mergePDFFromURIs };
