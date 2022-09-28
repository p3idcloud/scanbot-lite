'use strict';
//const aws = require('aws-sdk');
var mime = require('mime-types')
var Multer = require("multer");
var Minio = require('minio')
var minioClient = new Minio.Client({
    endPoint: process.env.AWS_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: (process.env.MINIO_USE_SSL === 'true'),
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY
});
var router =  require('express').Router();

const getBuckets = async (req, res) => {
  minioClient.listBuckets(function(err, data) {
        if (err) {
          console.log(err, err.stack);
          res.json({'error': err.stack});
        }
        else res.json(data);
      });
}

const createBucket = async (req, res) => {
    minioClient.makeBucket(req.params.bucketName, 'us-east-1', function(err) {
      if (err) return console.log('Error creating bucket.', err);
      console.log('Bucket created successfully in "us-east-1".');
      res.json({status: 'ok'})
    });
}

const uploadtoBucket = async (req, res) => {
  minioClient.putObject(req.params.bucketName, req.file.originalname, req.file.buffer, { 'Content-Type': mime.lookup(req.file.originalname) }, function(error, etag) {
    if(error) {
        return console.log(error);
    }    
    res.send(req.file);
  });
}

const getPresignedURL = async (req, res) => {
  minioClient.presignedUrl('GET', req.params.bucketName, req.params.objectName, 24*60*60, function(err, presignedUrl) {
    if (err) return console.log(err)
    res.send(presignedUrl);
  })
}


router.get('/', getBuckets);
router.post('/:bucketName', createBucket);
router.post('/:bucketName/upload', Multer({storage: Multer.memoryStorage()}).single("upload"), uploadtoBucket);
router.get('/:bucketName/:objectName', getPresignedURL);

module.exports = router;