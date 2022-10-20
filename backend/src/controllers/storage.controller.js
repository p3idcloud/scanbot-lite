const AccountService = require('../services/account');
const Minio = require('minio');
const PDFMerger = require('pdf-merger-js');
const nodemailer = require("nodemailer");

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

exports.mergePdfDocument = async (req, res) => {
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

exports.sendPdfDocument = async (req, res) => {
  try {
    const merger = new PDFMerger();

    const { imageURI, recipient } = req.body || {};
    if (!imageURI?.length) return res.status(400).send('No image URI provided');
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(String(recipient))) return res.status(400).send('Invalid recipient email');

    const account = await AccountService.getAccountFromId(req.twain.principalId);

    for await (const uri of imageURI) {
      const dataStream = await minioClient.getObject(account.id, uri);
      await merger.add(Buffer.from(await dataStreamToBuffer(dataStream)));
    }

    const mergedPdf = await merger.saveAsBuffer();

    // TODO change to a valid email account and transporter
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Scanbot Lite" <scanbot-lite@lyrid.io>',
      to: String(recipient),
      subject: "Test",
      text: "This is just a test",
      attachments: [{ filename: 'ScanBot.pdf', content: mergedPdf }],
    });

    return res.status(200).json({ message: 'Email sent', preview_url: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
