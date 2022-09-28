const uuid = require("uuid");
const iot = require('../utils/iotClient');
const jobService = require("../services/job");
const accountService = require("../services/account")
const queueService = require("../services/queue");
const scannerStateService = require("../services/scannerstate");
const { createScannerHistory, updateScannerHistory } = require("../services/scannerhistory");
const {updateScannerFromId} = require("../services/scanner");
const {createScannerSession, getScannerSessionFromId, updateScannerSessionFromId} = require("../services/scannersession");

const logger = require('../utils/logger')('local.controller');


exports.allLocal = async (req, res, next) => {
    const account = await accountService.getAccountFromId(req.twain.principalId)
    if (!account) {
        return res.status(400).send("Couldn't find account")
    }

    var body = req.body;
    const method = req.method;
    const authorizationstring = account.id;// this workaround , later change it to account id so scanner linked to an accountid
    let headers = req.headers;
    headers.authorization = authorizationstring;
    const scannerId = req.params.scannerId;
    const commandId = req.headers["x-twain-cloud-request-id"];
    const url = req.protocol + '://' + req.hostname + ':3000' + req.originalUrl;

    // TODO: check scanner is online
    // subscribe to mqtt topic to get the response
    if (method === 'POST' && body.method === 'waitForEvents') {
        iot.findPollCommandIdFromWaitForEventsThenSaveImagesToService(headers, scannerId, iot.getClientTopic(authorizationstring), body.params.sessionId);

        return res.status(200)
    }else{
        iot.startMQTTListener();
        iot.subscribeToTopic(iot.getClientTopic(authorizationstring));
        iot.listenToTopicAndSave(iot.getClientTopic(authorizationstring), commandId);
    
        // wss://emq.lyr.id:8084/mqtt
        iot.notifyScanner(scannerId, {
            headers,
            method,
            url,
            body: JSON.stringify(body)
        })
            .then(() => {})
            .catch(next);
    }

    if (method === 'GET' && req.originalUrl.substring(req.originalUrl.lastIndexOf('/')+1) === 'infoex'){
        const result = await iot.findCommandIdFromMessageContainer(iot.getClientTopic(authorizationstring), commandId);
        if (!result) {
            await scannerStateService.updateScannerState(scannerId,
                {
                "currentQueueId": "",
                "status": "offline",
                "sessionId": "",
                "latestEvent": "infoEx"
                }
            );
            return res.status(400).send("Scanner Offline / Undetected");
        }else {
            await updateScannerFromId(scannerId,
                {
                    "lastActive": new Date()
                });
            await scannerStateService.updateScannerState(scannerId,
                {
                "xPrivetToken": result['x-privet-token'],
                "status": result.device_state,
                "latestEvent": "infoEx"
                }
            );
            return res.status(200).json(result);
        }
    }else if (method === 'POST' && body.method === 'createSession') { // check if it send a startSession
        /*
        get the sessionId from the mqtt response.
        100% there must be a way to get the response without connecting to mqtt but idk
        ++ currently known how to is to:
        connect to mqtt with the topic provided before
        check whether commmandId is the same as the generated one above
        */

        const result = await iot.findCommandIdFromMessageContainer(iot.getClientTopic(authorizationstring), commandId);
        if (!result) {
            //this resolves if scanner not sending response
            await scannerStateService.updateScannerState(scannerId,
                {
                    "status": "error",
                    "latestEvent": body.method
                }
            );
            return res.status(400).json(body);
        }else{
            if(result.results.success == false){
                //this one is if the scanner stuck / busy (havent found out how to check the actual problem/scanner error)
                //i think from the spec, we can hit waitforstatus or something to check the error if stuck here, but idk
                await scannerStateService.updateScannerState(scannerId,
                    {
                    "status": result.results.code,
                    }
                );
                return res.status(400).json(result);
            }

            //success response:
            //{
            //   "commandId": "425DE3DF-C654-4424-A749-E5C33A3399DF",
            //   "kind": "twainlocalscanner",
            //   "method": "createSession",
            //   "results": {
            //     "session": {
            //       "doneCapturing": true,
            //       "imageBlocks": [],
            //       "imageBlocksDrained": true,
            //       "paperIn": false,
            //       "revision": 1,
            //       "sessionId": "25D474E7-9514-4198-9789-F8448A757877",
            //       "state": "ready",
            //       "status": {
            //         "detected": "nominal",
            //         "success": true
            //       }
            //     },
            //     "success": true
            //   }
            // }

            await createScannerSession({
                'id': result.results.session.sessionId,
                'scannerId': scannerId,
                'state': result.results.session.state,
                'revision': result.results.session.revision,
                'doneCapturing': result.results.session.doneCapturing,
                'status': result.results.session.status.detected,
                'paperIn': result.results.session.paperIn,
                'imageBlocks': result.results.session.imageBlocks
            })

            let createdJob = await jobService.createJob({
                'id' : uuid.v4(),
                'accountId': account.id,
                'sessionId': result.results.session.sessionId,
                'name': body.name,
                'description': body.description
            });
    
            let queue = await queueService.createQueue({
                'id': uuid.v4(),
                'jobId': createdJob.id,
                'scannerId': scannerId,
                'accountId': account.id,
                'startDate': new Date(),
                'status': result.results.session.state,
                'webSocketURL': process.env.MQTT_ENDPOINT,
                'webSocketToken': iot.getClientTopic(authorizationstring)
            });

            await createScannerHistory({
                'id': uuid.v4(),
                'queueId': queue.id,
                'userId': user.id,
                'scannerId': scannerId,
                'name': body.name,
                'description': body.description,
                'startDate': new Date(),
                'status': "In Progress",
                'pageCount': 0
            });

            await scannerStateService.updateScannerState(scannerId,
                {
                    "currentQueueId": queue.id,
                    "currentlyUsedByUserId":user.id,
                    "state": result.results.session.state,
                    "status": result.results.session.status.detected,
                    "sessionId": result.results.session.sessionId,
                    "latestEvent": result.method,
                    "lastCommandAt": Date.now()
                }
            );
            iot.findPollCommandIdFromWaitForEventsThenSaveImagesToService(headers, scannerId, iot.getClientTopic(authorizationstring), result.results.session.sessionId);
            return res.status(200).json(result);
        }
    }else if (method === 'POST' && body.method === 'sendTask') {
        //session state management
        let scannerSession = await getScannerSessionFromId(body.params.sessionId);
        if (scannerSession.state !== 'ready') {
            return res.status(400).send("Please wait for scanner to be ready");
        }

        const result = await iot.findCommandIdFromMessageContainer(iot.getClientTopic(authorizationstring), commandId);
        if (!result) {
            await scannerStateService.updateScannerState(scannerId,
                {
                    "status": "error",
                    "latestEvent": body.method
                }
            );
            return res.status(400).send("Scanner Offline / Undetected");
        }else{
            if(result.results.success == false){
                await scannerStateService.updateScannerState(scannerId,
                    {
                    "status": result.results.code,
                    }
                );
                return res.status(400).send("Scanner Error: "+ result.results.code +" . Please restart the service.");
            }


            //structure if going fine
            //{
            //   "commandId": "445DE3DF-C654-4424-A749-E5C33A3399DF",
            //   "kind": "twainlocalscanner",
            //   "method": "sendTask",
            //   "results": {
            //     "session": {
            //       "doneCapturing": true,
            //       "imageBlocks": [],
            //       "imageBlocksDrained": true,
            //       "paperIn": false,
            //       "revision": 2,
            //       "sessionId": "AD575B6E-991D-4240-B4E2-51FE27B63B97",
            //       "state": "ready",
            //       "status": {
            //         "detected": "nominal",
            //         "success": true
            //       },
            //       "task": {
            //         "actions": [
            //           {
            //             "action": "configure",
            //             "results": {
            //               "success": true
            //             },
            //             "streams": [
            //               {
            //                 "name": "stream0",
            //                 "sources": [
            //                   {
            //                     "name": "source0",
            //                     "pixelFormats": [
            //                       {
            //                         "attributes": [
            //                           {
            //                             "attribute": "numberOfSheets",
            //                             "values": [
            //                               {
            //                                 "value": 1
            //                               }
            //                             ]
            //                           }
            //                         ],
            //                         "name": "pixelFormat0",
            //                         "pixelFormat": "any"
            //                       }
            //                     ],
            //                     "source": "any"
            //                   }
            //                 ]
            //               }
            //             ]
            //           }
            //         ]
            //       }
            //     },
            //     "success": true
            //   }
            // }
            await updateScannerSessionFromId(scannerSession.id,{
                'state': result.results.session.state,
                'revision': result.results.session.revision,
                'doneCapturing': result.results.session.doneCapturing,
                'imageBlocksDrained': result.results.session.imageBlocksDrained,
                'status': result.results.session.status.detected,
                'paperIn': result.results.session.paperIn,
                'imageBlocks': result.results.session.imageBlocks
            })

            //get scanner state to get queueId
            let scannerState = await scannerStateService.updateScannerState(scannerId,
                {
                    "state": result.results.session.state,
                    "status": result.results.session.status.detected,
                    "latestEvent": result.method,
                    "lastCommandAt": Date.now()
                }
            );
            
            //update queue
            let currQueue = await queueService.updateQueue(scannerState.currentQueueId, {
                'lastModifiedDate': new Date(),
                'status': result.results.session.state,
            });

            //update job
            await jobService.updateJob(currQueue.jobId, {
                'profileData': result.results.session.task
            });

            return res.status(200).json(result);
        }
    }else if (method === 'POST' && body.method === 'startCapturing') {
        //session state management
        let scannerSession = await getScannerSessionFromId(body.params.sessionId);
        if (scannerSession.state !== 'ready') {
            return res.status(400).send("Please wait for scanner to be ready");
        }

        const result = await iot.findCommandIdFromMessageContainer(iot.getClientTopic(authorizationstring), commandId);
        if (!result) {
            await scannerStateService.updateScannerState(scannerId,
                {
                    "status": "error",
                    "latestEvent": body.method
                }
            );
            return res.status(400).send("Scanner Offline / Undetected");
        }else{
            //on success heres response:
            //{
            //   "commandId": "448DE3DF-C654-4424-A749-E5C33A3399DF",
            //   "kind": "twainlocalscanner",
            //   "method": "startCapturing",
            //   "results": {
            //     "session": {
            //       "backgroundData": {
            //         "bckgIsColor": true,
            //         "blueBack": 0,
            //         "blueFront": 0,
            //         "grayBack": 0,
            //         "grayFront": 0,
            //         "greenBack": 0,
            //         "greenFront": 0,
            //         "redBack": 0,
            //         "redFront": 0
            //       },
            //       "doneCapturing": false,
            //       "imageBlocks": [],
            //       "imageBlocksDrained": false,
            //       "paperIn": false,
            //       "revision": 3,
            //       "sessionId": "AD575B6E-991D-4240-B4E2-51FE27B63B97",
            //       "state": "capturing",
            //       "status": {
            //         "detected": "nominal",
            //         "success": true
            //       }
            //     },
            //     "success": true
            //   }
            // }


            if(result.results.success == false){
                await scannerStateService.updateScannerState(scannerId,
                    {
                    "status": result.results.code,
                    }
                );
                return res.status(400).send("Scanner Error: "+ result.results.code +" . Please restart the service.");
            }

            //update scanner session
            await updateScannerSessionFromId(scannerSession.id,{
                'state': result.results.session.state,
                'revision': result.results.session.revision,
                'doneCapturing': result.results.session.doneCapturing,
                'imageBlocksDrained': result.results.session.imageBlocksDrained,
                'status': result.results.session.status.detected,
                'paperIn': result.results.session.paperIn,
                'imageBlocks': result.results.session.imageBlocks
            })

            //get scanner state to get queueId
            let scannerState = await scannerStateService.updateScannerState(scannerId,
                {
                    "state": result.results.session.state,
                    "status": result.results.session.status.detected,
                    "latestEvent": result.method,
                    "lastCommandAt": Date.now()
                }
            );
            
            //update queue
            let currQueue = await queueService.updateQueue(scannerState.currentQueueId, {
                'lastModifiedDate': new Date(),
                'status': result.results.session.state,
            });

            //update job
            await jobService.updateJob(currQueue.jobId, {
                'profileData': result.results.session.task
            });

            return res.status(200).send(result);
        }
    }else if (method === 'POST' && body.method === 'closeSession') {
        //session state management
        let scannerSession = await getScannerSessionFromId(body.params.sessionId);
        if (scannerSession.state !== 'ready') {
            return res.status(400).send("Please wait for scanner to be ready");
        }

        const result = await iot.findCommandIdFromMessageContainer(iot.getClientTopic(authorizationstring), commandId);
        let scannerState = await scannerStateService.getScannerStateFromScannerId(scannerId);
        if (!result) {
            await scannerStateService.resetScannerState(scannerId);
            await scannerStateService.updateScannerState(scannerId,
                {
                    "status": "unknown error",
                    "latestEvent": body.method
                }
            );
            return res.status(400).send("Scanner Offline / Undetected");
        }else{
            if(result.results.success == false){
                await scannerStateService.updateScannerState(scannerId,
                    {
                    "status": result.results.code,
                    }
                );
                return res.status(400).send("Scanner Error: "+ result.results.code +" . Please restart the service.");
            }

            //update queue
            await queueService.updateQueue(scannerState.currentQueueId, {
                'lastModifiedDate': new Date(),
                'status': result.results.session.state,
            });

            await updateScannerHistory(scannerState.currentQueueId, {
                "status": "Completed"
            });

            await updateScannerSessionFromId(scannerSession.id,{
                'state': result.results.session.state,
                'revision': result.results.session.revision,
                'doneCapturing': result.results.session.doneCapturing,
                'imageBlocksDrained': result.results.session.imageBlocksDrained,
                'status': result.results.session.status.detected,
                'paperIn': result.results.session.paperIn,
                'imageBlocks': result.results.session.imageBlocks
            })

            await scannerStateService.resetScannerState(scannerId);

            return res.status(200).json(result);
        }
    }
        res.sendStatus(200);
};