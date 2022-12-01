async function mergePDFFromImageURIs(accountId, imageURIs) {
  const { Client } = require('minio');
  const PDFMerger = require('pdf-merger-js');
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

async function savePDFToDrive(mergedPdf) {
  const { google } = require('googleapis');
  const stream = require('stream');
  try {
    /* TODO implement better OAuth flow so user can login with their own account */
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    auth.setCredentials({ refresh_token: process.env.GOOGLE_TEST_TOKEN });

    const drive = google.drive({ version: 'v3', auth });

    const bufferStream = new stream.PassThrough();
    bufferStream.end(mergedPdf);

    const { data } = await drive.files.create({
      requestBody: { name: 'Scanbot-Lite.pdf' },
      media: { mimeType: 'application/pdf', body: bufferStream },
      fields: 'id,name,webViewLink',
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

module.exports = { mergePDFFromImageURIs, savePDFToDrive };
