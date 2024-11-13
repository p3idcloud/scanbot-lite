const AccountService = require('../services/account');
const Minio = require('minio');
const { retrieveC2paPdf } = require('./c2pa.controller');

const minioClient = new Minio.Client({
    endPoint: process.env.AWS_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: (process.env.MINIO_USE_SSL === 'true'),
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY
})


exports.getFileFromURI = async (req, res) => {
    const uri = req.params.uri + req.params[0];
    const account = await AccountService.getAccountFromId(req.twain.principalId);
    minioClient.getObject(account.id, uri, function(e, dataStream) {
        if (e) {
            return res.status(400).send(e)
        }else{
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=ScanBot.pdf');
            dataStream.pipe(res)
        }
    })
}