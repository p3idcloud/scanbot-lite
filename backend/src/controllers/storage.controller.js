const AccountService = require('../services/account');
const Minio = require('minio');
const PDFMerger = require('pdf-merger-js');

const minioClient = new Minio.Client({
  endPoint: process.env.AWS_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.AWS_ACCESS_KEY,
  secretKey: process.env.AWS_SECRET_KEY,
});

exports.getFileFromURI = async (req, res) => {
  const uri = req.params.uri + req.params[0];
  const account = await AccountService.getAccountFromId(req.twain.principalId);

  minioClient.getObject(account.id, uri, function (e, dataStream) {
    if (e) {
      return res.status(400).send(e);
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=ScanBot.pdf');
      dataStream.pipe(res);
    }
  });
};

function dataStreamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const _buf = [];

    stream.on('data', (chunk) => _buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(_buf)));
    stream.on('error', (err) => reject(err));
  });
}

exports.generatePdfDocument = async (req, res) => {
  try {
    const merger = new PDFMerger();

    const { imageURI } = req.body || {};
    if (!imageURI?.length) return res.status(400).send('No image URI provided');

    const account = await AccountService.getAccountFromId(req.twain.principalId);

    for await (const uri of imageURI) {
      const dataStream = await minioClient.getObject(account.id, uri);
      await merger.add(Buffer.from(await dataStreamToBuffer(dataStream)));
    }

    const mergedPdf = await merger.saveAsBuffer();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=ScanBot.pdf');
    res.end(mergedPdf);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
