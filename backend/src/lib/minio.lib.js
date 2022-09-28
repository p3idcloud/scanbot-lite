'use strict';
const Minio = require('minio');
const mime = require('mime-types');
const util = require('util');

const minioClient = new Minio.Client({
    endPoint: process.env.AWS_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: (process.env.MINIO_USE_SSL === 'true'),
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY
})

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

exports.getGlobalMinioClient =()=>{
    return minioClient;
}

exports.createBucket = async (bucketName) => {
    try{
        let bucketExist = await minioClient.bucketExists(bucketName)
        while (!bucketExist) {
            bucketExist = await minioClient.bucketExists(bucketName)
            if (!bucketExist) {
                await minioClient.makeBucket(bucketName, function(err) {
                    if (err) {
                        return "Couldn't create bucket"
                    }
                });
                await sleep(250);
            }
        }

        return true;
    } catch(e) {
        console.log(e)
        return e;
    }
}

exports.putObjectBuffer = async (bucketName, fileName, file, filename) => {
    try {
        await minioClient.putObject(bucketName, fileName, file, {
            'Content-Type': mime.lookup(filename)
        });

        return true
    } catch (e) {
        return e
    }
}

exports.putObject = async (bucketName, fileName, file, filename) => {
    try {
        await minioClient.putObject(bucketName, fileName, file.buffer, {
            'Content-Type': mime.lookup(filename)
        });

        return true
    } catch (e) {
        return e
    }
}

exports.presignedGetObject = async (accountId, uri) => {
    return new Promise((resolve,reject) => {
        minioClient.presignedGetObject(accountId, uri, 7*60*60, (err, presignedUrl) => {
            if (err) {
                return reject(err);
            }

            resolve(presignedUrl);
        });
    })
}

exports.removeMinioObject = async (accountId, uri) => {
    minioClient.removeObject(accountId, uri, function(err) {
        if (err) {
            return console.log('Unable to remove object', err)
        }
        console.log('Removed the object')
    })
}

exports.removeMinioObjects = async (accountId, uris) => {
    minioClient.removeObjects(accountId, uris, function(err) {
        if (err) {
            return console.log('Unable to remove object', err)
        }
        console.log('Removed the object')
    })
}