'use strict';

const uuid = require('uuid');
const mqtt = require('mqtt');
const {updateScannerSessionFromId, getScannerSessionFromId} = require("../services/scannersession");
const scannerStateService = require("../services/scannerstate");
const scannerService = require("../services/scanner");

const ScannerHistory = require('../services/scannerhistory');
const jobService = require("../services/job");
const {getQueueFromId} = require("../services/queue");
const {getJobFromId} = require("../services/job");
const {getFileIdFromBlockUrl, getFileIdFromArguments} = require("../routes/block");
const {removeMinioObject, putObjectBuffer, presignedGetObject} = require("../lib/minio.lib");
const {convertPdfToPng} = require("../lib/pdf.lib");
const {retrieveC2paPdf, storeC2paPng} = require("../controllers/c2pa.controller");
const c2paserv = require("../services/c2pa");
const logger = require('./logger')('iotClient');

var mqttclient;
var mqttWaitEventsClient;
var messageContainer = {};
var waitEventsContainer = {};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.startMQTTListener = () => {
  mqttclient = mqtt.connect(process.env.MQTT_ENDPOINT);
  mqttclient.on('connect', function () {
    console.log('Successfully Connected to mqtt')
  });
};

module.exports.stopMQTTListener = () => {
  mqttclient.end();
};

module.exports.subscribeToTopic = function (topic) {
  mqttclient.subscribe(topic);
  if (!messageContainer[topic]) {
    messageContainer[topic] = {};
  }
};

module.exports.listenToTopicAndSave = async (waitTopic, commandId) => {
  mqttclient.on('message', (topic, message) => {
    const parsedMessage = JSON.parse(message.toString());
    const requestId = parsedMessage.requestId;
    const parsedBody = JSON.parse(parsedMessage.body);
    const topicPlus = topic.slice(0, topic.lastIndexOf('/')+1)+'+';
    if (!messageContainer[topicPlus]) {
      messageContainer[topicPlus] = {};
    }
    messageContainer[topicPlus][requestId] = parsedBody;

    // No need to end MQTT session for now
    //if (topic.includes(waitTopic.slice(0, -1))){
    //check commandId same as the message? if so end mqtt
    //mqttclient.end();
    //}
  });
};

module.exports.findCommandIdFromMessageContainer = async (topic, commandId) => {
  let myPromise = new Promise(function(resolve,reject){
    var counter = 0;
    var reChecker = setInterval(() => {
      if (counter === 250) { //x*200ms this will make the whole process wait for x seconds. longest command would be createsession , sometime took more than 10 secs, but never more than 15 afaik
        clearInterval(reChecker);
        resolve(null);
      }
      if (messageContainer[topic][commandId]) {
        const retValue = messageContainer[topic][commandId];
        delete messageContainer[topic][commandId];
        clearInterval(reChecker);
        resolve(retValue);
      }
      counter++;
    }, 200);
  });
  return await myPromise;
};

module.exports.findCommandIdFromWaitEventsContainer = async (topic, commandId) => {
  let myPromise = new Promise(function(resolve,reject){
    let counter = 0;
    var reChecker = setInterval(() => {
      const util = require('util')
      console.log(util.inspect(waitEventsContainer, false, null, true));
      if (counter === 50) {
        clearInterval(reChecker);
        resolve(null);
      }
      if (waitEventsContainer[topic][commandId]) {
        const retValue = waitEventsContainer[topic][commandId];
        delete waitEventsContainer[topic][commandId];
        clearInterval(reChecker);
        resolve(retValue);
      }
      counter++;
    }, 2000);
  });
  return await myPromise;
};

module.exports.askScannerToUploadToService = async (topic) => {
  const commandId = uuid.v4();
  const headers = {"Authorization":authorization,"x-twain-cloud-request-id":commandId,"x-privet-token":privetToken};
  const method = "post";
  const url = `http://thisshouldbeurl.or.no`;
  const body = {
    "kind": "twainlocalscanner",
    "commandId": commandId,
    "method": "waitForEvents",
    "params": {
      "sessionId": sessionId,
    }
  };

  notifyScanner(scannerId, {
    headers, //headers
    method,
    url,
    body: JSON.stringify(body)
  });

  let myPromise = new Promise(function(resolve,reject){
    var counter = 0;
    var reChecker = setInterval(() => {
      if (counter === 50) {
        clearInterval(reChecker);
        resolve(null);
      }
      if (messageContainer[topic][commandId]) {
        const retValue = messageContainer[topic][commandId];
        delete messageContainer[topic][commandId];
        clearInterval(reChecker);
        resolve(retValue);
      }
      counter++;
    }, 200);
  });
  return await myPromise;
};

module.exports.releaseImageBlock = async ({topic, currScanner, headers, scannerId, sessionId, scannerSession, forceClose}) => {
  // TODO: handle all stuck logic here
  let resultBlock;
  if (forceClose) { // We are force closing this
    // If Capturing
    if (scannerSession.state === 'capturing') {
      // Stop capturing
      const commandIdStopCapturing = uuid.v4();
      let newHeaders = Object.assign({}, headers);
      newHeaders['x-twain-cloud-request-id'] = commandIdStopCapturing;
      let bodyStopCapturing = {
        "kind": "twainlocalscanner",
        "commandId": commandIdStopCapturing,
        "method": "stopCapturing",
        "params": {
          "sessionId": sessionId,
        }
      };

      //ask scanner to stop capturing
      exports.notifyScanner(scannerId, {
        headers: newHeaders, //headers
        method: "POST",
        url: `${process.env.BASE_URL}api/scanners/${scannerId}/twaindirect/session`,
        body: JSON.stringify(bodyStopCapturing)
      });
      let resultStopCapturing = await exports.findCommandIdFromMessageContainer(topic, commandIdStopCapturing);
      resultBlock = resultStopCapturing.results.session.imageBlocks;

      await updateScannerSessionFromId(scannerSession.id,{
        'state': resultStopCapturing.results.session.state,
        'revision': resultStopCapturing.results.session.revision,
        'imageBlocks': resultStopCapturing.results.session.imageBlocks
      })

      await scannerStateService.updateScannerState(scannerId,
          {
            "state": resultStopCapturing.results.session.state,
            "status": resultStopCapturing.results.session.status.detected,
            "latestEvent": resultStopCapturing.method,
            "lastCommandAt": Date.now()
          }
      );
    }
  } else {
    const commandIdReadImage = uuid.v4();
    let newHeaders = Object.assign({}, headers);
    newHeaders['x-twain-cloud-request-id'] = commandIdReadImage;
    let bodyReadImageBlock = {
      "kind": "twainlocalscanner",
      "commandId": commandIdReadImage,
      "method": "readImageBlock",
      "params": {
        "imageBlockNum": 1,
        "sessionId": sessionId,
        "withImageBlockUrl": false,
        "withMetadata": false
      }
    };

    //ask scanner to upload imageBlock to service
    exports.notifyScanner(scannerId, {
      headers: newHeaders, //headers
      method: "POST",
      url: `${process.env.BASE_URL}api/scanners/${scannerId}/twaindirect/session`,
      body: JSON.stringify(bodyReadImageBlock)
    });

    let resultImageUpload = await exports.findCommandIdFromWaitEventsContainer(topic, commandIdReadImage);
    resultBlock = resultImageUpload.results.session.imageBlocks;
  }

  //release image blocks
  const commandIdReleaseImageBlock = uuid.v4();
  let newHeaders = Object.assign({}, headers);
  newHeaders['x-twain-cloud-request-id'] = commandIdReleaseImageBlock;
  let bodyReleaseImageBlocks = {
    "kind": "twainlocalscanner",
    "commandId": commandIdReleaseImageBlock,
    "method": "releaseImageBlocks",
    "params": {
      "sessionId": sessionId,
      "imageBlockNum": resultBlock[0],
      "lastImageBlockNum": (resultBlock[resultBlock.length-1])
    }
  }
  if (currScanner.manufacturer === 'Xerox') {
    bodyReleaseImageBlocks.params.lastImageBlockNum = -1;
  }

  //ask scanner to releaseImageBlocks
  //halt awhile before asking scanner to drain images...

  exports.notifyScanner(scannerId, {
    headers: newHeaders, //headers
    method: "POST",
    url: `${process.env.BASE_URL}api/scanners/${scannerId}/twaindirect/session`,
    body: JSON.stringify(bodyReleaseImageBlocks)
  });
  let result = await exports.findCommandIdFromMessageContainer(topic, commandIdReleaseImageBlock);

  await updateScannerSessionFromId(scannerSession.id,{
    'state': result.results.session.state,
    'revision': result.results.session.revision,
    'imageBlocks': result.results.session.imageBlocks
  })

  await scannerStateService.updateScannerState(scannerId,
      {
        "state": result.results.session.state,
        "status": result.results.session.status.detected,
        "latestEvent": result.method,
        "lastCommandAt": Date.now()
      }
  );
}

module.exports.findPollCommandIdFromWaitForEventsThenSaveImagesToService = async (aheaders, scannerId, topic, sessionId, accountId) => {
  const currScanner = await scannerService.getScannerFromId(scannerId);
  //do a polling to send : waitForEvents
  //save timenow @the first time ppl throw a startSession command << is in queue.startDate
  //
  if (!mqttWaitEventsClient){
    mqttWaitEventsClient = mqtt.connect(process.env.MQTT_ENDPOINT);
  } else if (!mqttWaitEventsClient.connected) {
    let attempts = 1;
    while ((!await mqttWaitEventsClient.reconnect()) && attempts <= 5) {
      logger.info('Reconnecting MQTT waitforevents client');
      attempts += 1;
    }
  }
  mqttWaitEventsClient.subscribe(topic);
  if (!waitEventsContainer[topic]) {
    waitEventsContainer[topic] = {};
  }
  mqttWaitEventsClient.on('message', (topic, message) => {
    const parsedMessage = JSON.parse(message.toString());
    const requestId = parsedMessage.requestId;
    const parsedBody = JSON.parse(parsedMessage.body);
    const topicPlus = topic.slice(0, topic.lastIndexOf('/')+1)+'+';
    if (!waitEventsContainer[topicPlus]) {
      waitEventsContainer[topicPlus] = {};
    }
    if (parsedBody.method === 'waitForEvents' || parsedBody.method === 'readImageBlock'){
      waitEventsContainer[topicPlus][requestId] = parsedBody;
    }
  });
  
  let sessionRevision = 1;
  let uploadedImageBlock = [];
  let weDoneYet = false;
  let startTime = Date.now();
  const scannerSession = await getScannerSessionFromId(sessionId);
  let oneMoreTry = false;
  const timeout = 300 * 1000; //300s to ms

  while(!weDoneYet && Date.now() - startTime < timeout){ //keep polling this until condition or timeout
    const commandId = uuid.v4();
    let headers = Object.assign({}, aheaders);
    headers['x-twain-cloud-request-id'] = commandId;
    const method = "POST";
    const url = `${process.env.BASE_URL}api/scanners/${scannerId}/twaindirect/session`;
    const body = {
      "kind": "twainlocalscanner",
      "commandId": commandId,
      "method": "waitForEvents",
      "params": {
        "sessionId": sessionId,
        "sessionRevision": sessionRevision
      }
    };
    //console.log("hitting wait for events")
    exports.notifyScanner(scannerId, {
      headers, //headers
      method,
      url,
      body: JSON.stringify(body)
    });
  
    //make this async
    let waitContainerFound = await exports.findCommandIdFromWaitEventsContainer(topic, commandId);
    try {
      //paper jam :
      //{
      // 	"body": {
      // 		"commandId": "71DFA1A0-B001-4445-92A9-68F7E8450315",
      // 		"kind": "twainlocalscanner",
      // 		"method": "waitForEvents",
      // 		"results": {
      // 			"events": [
      // 				{
      // 					"event": "imageBlocks",
      // 					"session": {
      // 						"doneCapturing": true,
      // 						"imageBlocks": [],
      // 						"imageBlocksDrained": true,
      // 						"paperIn": false,
      // 						"revision": 4,
      // 						"sessionId": "FEDE9715-28A5-4456-B3F3-881435EB52AA",
      // 						"state": "capturing",
      // 						"status": {
      // 							"detected": "paperJam",
      // 							"success": false
      // 						}
      // 					}
      // 				}
      // 			],
      // 			"success": true
      // 		}
      // 	},
      // 	"headers": {
      // 		"content-Length": 391,
      // 		"content-Type": "application/json; charset=UTF-8"
      // 	},
      // 	"requestId": "71DFA1A0-B001-4445-92A9-68F7E8450315",
      // 	"statusCode": 200,
      // 	"statusDescription": ""
      // }
      //can use this to get if no paper found
      // if(waitContainerFound?.results?.code == 'timeout'){
      //   {
      //     commandId: '8061c870-bfc6-412e-ae29-850b58baed17',
      //     kind: 'twainlocalscanner',
      //     method: 'waitForEvents',
      //     results: {
      //       code: 'timeout',
      //       session: {
      //         doneCapturing: true,
      //         imageBlocks: [],
      //         imageBlocksDrained: true,
      //         paperIn: false,
      //         revision: 7,
      //         sessionId: '6312F0F1-9DAA-4D2E-A06F-7EEFBD7F3EB3',
      //         state: 'capturing',
      //         status: { detected: 'noMedia', success: false }
      //       },
      //       success: false
      //     }
      //   }
      //   waitContainerFound?.results?.session.status
      // }
      // this is on paper jam i think
      // {
      //   commandId: '655db4bb-3aca-4abb-904d-8a71c569f70f',
      //   kind: 'twainlocalscanner',
      //   method: 'waitForEvents',
      //   results: {
      //     events: [
      //       {
      //         event: 'imageBlocks',
      //         session: {
      //           doneCapturing: true,
      //           imageBlocks: [],
      //           imageBlocksDrained: true,
      //           paperIn: false,
      //           revision: 6,
      //           sessionId: '5F04989E-63D1-43C0-9B39-18BEDABEF036',
      //           state: 'capturing',
      //           status: { detected: 'imageError', success: false }
      //         }
      //       }
      //     ],
      //     success: true
      //   }
      // }
      //if ( waitContainerFound.results && waitContainerFound.results.session && waitContainerFound.results.session.imageBlocks && waitContainerFound.results.session.imageBlocks.length !== 0 ) {
      //console.log("here?");
      //console.log(waitContainerFound.results.session.imageBlocks);
      //if (JSON.stringify(waitContainerFound.results.session.imageBlocks) !== JSON.stringify(uploadedImageBlock) ){
      //if ( waitContainerFound ? waitContainerFound.results ? waitContainerFound.results.session ? waitContainerFound.results.session.imageBlocks ? waitContainerFound.results.session.imageBlocks.length : 0:0:0:0 !== 0 && JSON.stringify(waitContainerFound ? waitContainerFound.results ? waitContainerFound.results.session ? waitContainerFound.results.session.imageBlocks : 0:0:0) !== JSON.stringify(uploadedImageBlock)) {
      try {
        //do a timeout check
        //this happens when an event is timed out (Twain pdf03 page 14)
        //this will happen if theres no further command after 30 second. session is not stopped at this point.
        if ( waitContainerFound?.results?.code === 'timeout' ){
          //mostly this happen when we have error such as paper jam or something
          await updateScannerSessionFromId(scannerSession.id,{
            'state': waitContainerFound.results.session.state,
            'revision': waitContainerFound.results.session.revision,
            'doneCapturing': waitContainerFound.results.session.doneCapturing,
            'imageBlocksDrained': waitContainerFound.results.session.imageBlocksDrained,
            'status': waitContainerFound.results.session.status.detected,
            'paperIn': waitContainerFound.results.session.paperIn,
            'imageBlocks': waitContainerFound.results.session.imageBlocks
          })

          await scannerStateService.updateScannerState(scannerId,
              {
                "state": waitContainerFound.results.session.state,
                "status": waitContainerFound.results.session.status.detected,
                "latestEvent": waitContainerFound.method
              }
          );
        }

        if (waitContainerFound == null) { //if after 100 seconds we got nothing
          if (!oneMoreTry) {
            exports.notifyScanner(scannerId, {
              headers, //headers
              method,
              url,
              body: JSON.stringify(body)
            });
            oneMoreTry = true;
          } else {
            mqttWaitEventsClient.unsubscribe(topic);
            weDoneYet=true;
            break;
          }
        }
        if (waitContainerFound?.results.code === 'invalidSessionId') {
          weDoneYet=true;
          break;
        }
        if ( waitContainerFound?.results?.events?.[0]?.session?.imageBlocks?.length > 0 ) {
          //update state and session
          await updateScannerSessionFromId(scannerSession.id,{
            'state': waitContainerFound.results.events[0].session.state,
            'revision': waitContainerFound.results.events[0].session.revision,
            'doneCapturing': waitContainerFound.results.events[0].session.doneCapturing,
            'imageBlocksDrained': waitContainerFound.results.events[0].session.imageBlocksDrained,
            'status': waitContainerFound.results.events[0].session.status.detected,
            'paperIn': waitContainerFound.results.events[0].session.paperIn,
            'imageBlocks': waitContainerFound.results.events[0].session.imageBlocks
          })

          await scannerStateService.updateScannerState(scannerId,
              {
                "state": waitContainerFound.results.events[0].session.state,
                "status": waitContainerFound.results.events[0].session.status.detected,
                "latestEvent": waitContainerFound.method
              }
          );



          // get & update scannerstate
          let scannerState = await scannerStateService.getScannerStateFromScannerId(scannerId);
          scannerState.latestEvent = 'Uploading image to Cloud';

          // get Queue From ScannerState
          const queue = await getQueueFromId(scannerState.currentQueueId);
          // get & update Job from Queue
          let job = await getJobFromId(queue.jobId);

          let resultImageUpload = {};
          let imageChunkOrdering = {};
          let maxImagePart = {};
          let imageBlocks = waitContainerFound.results.events[0].session.imageBlocks;
          while ([...imageBlocks].length !== [...uploadedImageBlock].length) {
            // logger.info(`Current Image Blocks: ${JSON.stringify(imageBlocks ?? [])}`);
            // logger.info(`Uploaded Image Blocks: ${JSON.stringify(uploadedImageBlock)}`);
            for (const item of imageBlocks){
              //console.log("getting image:"+ item);
              if (!uploadedImageBlock.includes(item)){
                const commandIdReadImage = uuid.v4();
                let headers = Object.assign({}, aheaders);
                headers['x-twain-cloud-request-id'] = commandIdReadImage;
                let bodyReadImageBlock = {
                  "kind": "twainlocalscanner",
                  "commandId": commandIdReadImage,
                  "method": "readImageBlock",
                  "params": {
                    "imageBlockNum": item,
                    "sessionId": sessionId,
                    "withImageBlockUrl": true,
                    "withMetadata": true
                  }
                };

                //ask scanner to upload imageBlock to service
                exports.notifyScanner(scannerId, {
                  headers, //headers
                  method,
                  url,
                  body: JSON.stringify(bodyReadImageBlock)
                });
                //TODO:: test whether this is better be hit from the normal mqtt. because this doesnt need to be polled
                resultImageUpload = await exports.findCommandIdFromWaitEventsContainer(topic, commandIdReadImage);

                // Sample metadata
                //"metadata": {
                //       "address": {
                //         "boundary": "band",
                //         "imageNumber": 2,                -> second page image
                //         "imagePart": 1,                  -> first part of page image
                //         "moreParts": "morePartsPending", -> will have a second chunk for second page image
                //         "pixelFormatName": "pixelFormat0",
                //         "scanMode": "duplex",
                //         "sheetNumber": 1,
                //         "source": "feederRear",
                //         "sourceName": "source0",
                //         "streamName": ""
                //       },
                let lastPartOfImage = resultImageUpload.results.metadata.address.moreParts === "lastPartInFile";
                let imageNumber = resultImageUpload.results.metadata.address.imageNumber;
                let imagePart = resultImageUpload.results.metadata.address.imagePart;
                let imageBlockUrl = resultImageUpload.results.imageBlockUrl;
                if (!imageChunkOrdering[imageNumber]) {
                  // Initialize
                  imageChunkOrdering[imageNumber] = {};
                }
                imageChunkOrdering[imageNumber][imagePart] = imageBlockUrl;
                if (lastPartOfImage) {
                  // Set the max of image part
                  maxImagePart[imageNumber] = imagePart;
                }

                // Check if all chunks have been loaded
                if (Object.keys(imageChunkOrdering[imageNumber]).length === maxImagePart[imageNumber]) {
                  console.time("uploadChunkTime");
                  // Last image chunk has been loaded...
                  // We want to update data in scan history
                  //TODO: add timer and time both of these:
                  // await handleUploadChunksOld({
                  //   imageChunkOrdering,
                  //   pageNumber: imageNumber,
                  //   accountId,
                  //   scannerId,
                  //   queue,
                  //   job,
                  //   scannerState
                  // });

                  await handleUploadChunks({
                    imageChunkOrdering,
                    pageNumber: imageNumber,
                    accountId,
                    scannerId,
                    queue,
                    job,
                    scannerState
                  });

                  console.log('\n---------UPLOAD CHUNK TIME----------\n')
                  console.timeEnd("uploadChunkTime");
                  console.log('\n---------UPLOAD CHUNK TIME----------\n')
                }

                await updateScannerSessionFromId(scannerSession.id,{
                  'state': resultImageUpload.results.session.state,
                  'revision': resultImageUpload.results.session.revision,
                  'imageBlocks': resultImageUpload.results.session.imageBlocks
                })

                // await scannerStateService.updateScannerState(scannerId,
                //     {
                //       "state": resultImageUpload.results.session.state,
                //       "status": resultImageUpload.results.session.status.detected,
                //       "latestEvent": resultImageUpload.method,
                //       "lastCommandAt": Date.now()
                //     }
                // );

                uploadedImageBlock.push(item);

              }
            }
            if (resultImageUpload?.results?.session?.imageBlocks) {
              imageBlocks = resultImageUpload?.results?.session?.imageBlocks;
            }
          }

          // logger.info("Done capturing...");
          // logger.info(resultImageUpload?.results?.session?.imageBlocks);
          // stop capture & release image block if all paper has been captured
          // logger.info(`uploadedImageBlock: ${JSON.stringify(uploadedImageBlock)}`);
          // logger.info(`waitContainerFound.results.events[0].session.imageBlocks: ${JSON.stringify(waitContainerFound.results.events[0].session.imageBlocks)}`);
          // logger.info(`waitContainerFound.results.events[0].session.doneCapturing: ${waitContainerFound.results.events[0].session.doneCapturing}`);
          // logger.info(`resultImageUpload?.results?.session?.imageBlocks: ${JSON.stringify(resultImageUpload?.results?.session?.imageBlocks ?? [])}`);
          // logger.info(`resultImageUpload?.results?.session?.doneCapturing: ${resultImageUpload?.results?.session?.doneCapturing}`);

          if(uploadedImageBlock.length > 0 && (
              (
                  uploadedImageBlock.length === waitContainerFound.results.events[0].session.imageBlocks.length
                  && waitContainerFound.results.events[0].session.doneCapturing === true
              )
               ||
              (
                  uploadedImageBlock.length === (resultImageUpload?.results?.session?.imageBlocks ?? []).length
                  && resultImageUpload?.results?.session?.doneCapturing === true
              )
          )){
            // Stop capturing
            const commandIdStopCapturing = uuid.v4();
            let headers = Object.assign({}, aheaders);
            headers['x-twain-cloud-request-id'] = commandIdStopCapturing;
            let bodyStopCapturing = {
              "kind": "twainlocalscanner",
              "commandId": commandIdStopCapturing,
              "method": "stopCapturing",
              "params": {
                "sessionId": sessionId,
              }
            };

            // logger.info('Stop Capturing...')

            //ask scanner to stop capturing
            exports.notifyScanner(scannerId, {
              headers, //headers
              method,
              url,
              body: JSON.stringify(bodyStopCapturing)
            });
            let resultStopCapturing = await exports.findCommandIdFromMessageContainer(topic, commandIdStopCapturing);

            await updateScannerSessionFromId(scannerSession.id,{
              'state': resultStopCapturing.results.session.state,
              'revision': resultStopCapturing.results.session.revision,
              'imageBlocks': resultStopCapturing.results.session.imageBlocks
            })

            await scannerStateService.updateScannerState(scannerId,
                {
                  "state": resultStopCapturing.results.session.state,
                  "status": resultStopCapturing.results.session.status.detected,
                  "latestEvent": resultStopCapturing.method,
                  "lastCommandAt": Date.now()
                }
            );

            await exports.releaseImageBlock({
              headers,
              topic,
              sessionId,
              currScanner,
              scannerId,
              scannerSession,
              forceClose: false,
            });

            uploadedImageBlock = [];

          }
        }
        //CASES PER CASES HERE
        //If we detected paper is in (from no media)
        //then we must stopCapturing first before available-ing the startCapturing button again.
        if(waitContainerFound?.results?.events?.[0]?.event === 'paperIn' && waitContainerFound?.results?.events?.[0]?.session?.paperIn === true) {
          console.log('Paper in = ')
          console.log(waitContainerFound?.results?.events?.[0]?.session?.paperIn)

          //ask scanner to stop capturing
          const commandIdStopCapturing = uuid.v4();
          let headers = Object.assign({}, aheaders);
          headers['x-twain-cloud-request-id'] = commandIdStopCapturing;
          let bodyReadImageBlock = {
            "kind": "twainlocalscanner",
            "commandId": commandIdStopCapturing,
            "method": "stopCapturing",
            "params": {
              "sessionId": sessionId,
            }
          };
          console.log('stopped capturing')

          //ask scanner to upload imageBlock to service
          exports.notifyScanner(scannerId, {
            headers, //headers
            method,
            url,
            body: JSON.stringify(bodyReadImageBlock)
          });


          await scannerStateService.updateScannerState(scannerId, {
            "state": 'ready',
            "status": 'paper loaded',
            "latestEvent": waitContainerFound.method
          })
          await updateScannerSessionFromId(scannerSession.id,{
            'state': 'Ready',
            'revision': waitContainerFound.results.events[0].session.revision,
            'doneCapturing': waitContainerFound.results.events[0].session.doneCapturing,
            'imageBlocksDrained': waitContainerFound.results.events[0].session.imageBlocksDrained,
            'status': 'Paper Loaded',
            'paperIn': waitContainerFound.results.events[0].session.paperIn,
            'imageBlocks': waitContainerFound.results.events[0].session.imageBlocks
          })

        } else if (waitContainerFound?.results?.session?.status?.detected) {
          await scannerStateService.updateScannerState(scannerId, {
            "status": waitContainerFound?.results?.session?.status?.detected,
          })
          await updateScannerSessionFromId(scannerSession.id,{
            'status': waitContainerFound?.results?.session?.status?.detected,
          })
        }
      } catch (error) {
        console.log(error);
        // logger.info(error);
        weDoneYet=true;
      }

      const dbState = await scannerStateService.getScannerStateFromScannerId(scannerId);
      if (dbState.sessionId === "")
      {
        console.log("Session is already closed: " + dbState.revision);
        weDoneYet=true;
      }

      sessionRevision++;
      console.log("Session rev: " + sessionRevision);

    } catch (error) {
      console.log(error);
      weDoneYet=true;
    }
  }
  mqttWaitEventsClient.unsubscribe(topic);
  return null
};

module.exports.printGlobalMessageContainer = () => {
  console.log(messageContainer);
}

const appendUint8Arrays = (array1, array2) => {
  // Create a new Uint8Array with the combined length of the input arrays
  const combinedArray = new Uint8Array(array1.length + array2.length);

  // Copy the contents of the first input array to the combined array
  combinedArray.set(array1);

  // Copy the contents of the second input array to the combined array
  combinedArray.set(array2, array1.length);

  return combinedArray;
}

const publishMqttMessage = function(message) {
  var client = mqtt.connect(process.env.MQTT_ENDPOINT);
  return new Promise((resolve, reject) => {
    client.publish(message.topic, message.payload, { qos: message.qos, retain: message.retain }, (err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
};

const combineChunksAndUpload = async ({ imageChunkOrdering, pageNumber, accountId, fileId, blockId }) => {
  let partNumber = 1;
  let pdfData = new Uint8Array([]);
  while (imageChunkOrdering[pageNumber][partNumber]) {
    let imageBlockUrl = imageChunkOrdering[pageNumber][partNumber];
    let uri = getFileIdFromBlockUrl(imageBlockUrl);
    let pdfBuffer = await fetch(imageBlockUrl).then((res) => res.arrayBuffer());
    pdfData = appendUint8Arrays(pdfData, new Uint8Array(pdfBuffer));
    logger.info(`removing temp files from minio: ${uri}`);
    removeMinioObject(accountId, uri);
    partNumber += 1;
  }
  logger.info(`uploading combined file to minio: ${fileId}`);
  const resultBuffer = Buffer.from(pdfData.buffer, pdfData.byteOffset, pdfData.byteLength)
  const fileName = blockId+'.pdf';
  await putObjectBuffer(accountId, fileId, resultBuffer, fileName);
  return { resultBuffer, fileName: blockId };
}

const createC2paPngAndStore = async ({ accountId, fileUrl, pdfTitle, pdfBuffer }) => {
  const mimeType = 'image/png';
  let buffer;
  if (Buffer.isBuffer(pdfBuffer)) {
    buffer = pdfBuffer;
  } else {
    const pdfResult = await retrieveC2paPdf(accountId, fileUrl);
    buffer = Buffer.from(await pdfResult.arrayBuffer());
  }

  const file = {
    buffer,
    mimeType: 'application/pdf',
  }
  const pngDataUrl = await convertPdfToPng({ file });
  if (!pngDataUrl) {
    return;
  }
  const result = await c2paserv.signingManifest(pngDataUrl, mimeType, pdfTitle);

  // Store in minio
  if (result?.buffer) {
    storeC2paPng(accountId, fileUrl, result.buffer);
  }
}

/**
 * This is the function that will combine the image chunks from minio
 * Probably the blocker here
 * @param imageChunkOrdering
 * @param pageNumber
 * @param accountId
 * @param scannerId
 * @param queue
 * @param job
 * @param scannerState
 * @returns {Promise<void>}
 */
const handleUploadChunks = async ({imageChunkOrdering, pageNumber, accountId, scannerId, queue, job, scannerState}) => {
  let fileUrl;

  if (Object.keys(imageChunkOrdering[pageNumber]).length > 1) {
    const blockId = uuid.v4();
    const fileId = getFileIdFromArguments(accountId, scannerId, blockId);
    fileUrl = fileId;

    const { resultBuffer, fileName } = await combineChunksAndUpload({ imageChunkOrdering, pageNumber, accountId, blockId, fileId });
    await createC2paPngAndStore({ accountId, fileUrl, pdfTitle: fileName, pdfBuffer: resultBuffer });
    await jobService.pushInsertImageURI(job.id, fileId, { index: pageNumber - 1 });
    const url = await presignedGetObject(accountId, fileId);
    await scannerStateService.pushInsertImageURI(scannerState.scannerId, url, { index: pageNumber - 1 });
    
  } else if (Object.keys(imageChunkOrdering[pageNumber]).length === 1) {
    let uri = getFileIdFromBlockUrl(imageChunkOrdering[pageNumber][1]);
    fileUrl = uri;
    await jobService.pushInsertImageURI(job.id, uri, { index: pageNumber - 1 });
    await scannerStateService.pushInsertImageURI(scannerState.scannerId, imageChunkOrdering[pageNumber][1], { index: pageNumber - 1 });

    await createC2paPngAndStore({ accountId, fileUrl, pdfTitle: imageChunkOrdering[pageNumber][1] });
  }

  logger.info(`Uploaded Image number -- ${pageNumber}`);
  
  await ScannerHistory.incrementPageCount(queue.id);
};

// const handleUploadChunksOld = async ({imageChunkOrdering, pageNumber, accountId, scannerId, queue, job, scannerState}) => {
//   if (Object.keys(imageChunkOrdering[pageNumber]).length > 1) {
//     // Combine multiple chunks
//     let partNumber = 1;
//     let pdfData = new Uint8Array([]);
//     while (imageChunkOrdering[pageNumber][partNumber]) {
//       let imageBlockUrl = imageChunkOrdering[pageNumber][partNumber];
//       let uri = getFileIdFromBlockUrl(imageBlockUrl);
//       let pdfBuffer = await fetch(imageBlockUrl).then((res) => res.arrayBuffer());
//       pdfData = appendUint8Arrays(pdfData, new Uint8Array(pdfBuffer));
//       logger.info(`removing temp files from minio: ${uri}`);
//       removeMinioObject(accountId, uri);
//       partNumber += 1;
//     }
//     const blockId = uuid.v4();
//     const fileId = getFileIdFromArguments(accountId, scannerId, blockId);
//     logger.info(`uploading combined file to minio: ${fileId}`);
//     await jobService.pushInsertImageURI(job.id, fileId, { index: pageNumber-1 });
//     const url = await presignedGetObject(accountId, fileId);
//     await scannerStateService.pushInsertImageURI(scannerState.scannerId, url, { index: pageNumber-1 });
//     await putObjectBuffer(accountId, fileId, Buffer.from(pdfData.buffer, pdfData.byteOffset, pdfData.byteLength), blockId+'.pdf');
//   } else if (Object.keys(imageChunkOrdering[pageNumber]).length === 1) {
//     // Only one chunk
//     let uri = getFileIdFromBlockUrl(imageChunkOrdering[pageNumber][1]);
//     await jobService.pushInsertImageURI(job.id, uri, { index: pageNumber-1 });
//     await scannerStateService.pushInsertImageURI(scannerState.scannerId, imageChunkOrdering[pageNumber][1], { index: pageNumber-1 });
//   }
//   logger.info(`Uploaded Image number -- ${pageNumber}`);
//   await ScannerHistory.incrementPageCount(queue.id);
// }

module.exports.signMqttUrl = function signMqttUrl() {
  return Promise.resolve(process.env.MQTT_ENDPOINT);
};

module.exports.notifyScanner = function (scannerId, message) {
  logger.info(`notify scanner: ${scannerId}, message: ${JSON.stringify(message)}`);
  
  const mqttMessage = {
    topic: this.getDeviceRequestTopic(scannerId),
    payload: JSON.stringify(message),
    qos: 0, // 0, 1, or 2
    retain: false // or true
  };

  return publishMqttMessage(mqttMessage);
};

module.exports.notifySession = function (sessionId, message) {
  logger.info(`notify session: ${sessionId}, message: ${JSON.stringify(message)}`);
  
  const mqttMessage = {
    topic: `twain/sessions/${sessionId}/fromCloud`,
    payload: JSON.stringify(message),
    qos: 0, // 0, 1, or 2
    retain: false // or true
  };

  return publishMqttMessage(mqttMessage);
};

// TODO: remove duplication
module.exports.getClientTopic = function (userId) {
  return `twain/users/${userId}/+`;
};

module.exports.getDeviceRequestTopic = function (scannerId) {
  return `twain/devices/${scannerId}`;
};

module.exports.getDeviceResponseTopic = function (userId) {
  // TODO: ideally, it would be session ID. Let's think about this a bit.
  const randomTopicId = uuid.v4();
  
  return `twain/users/${userId}/${randomTopicId}`;
};

module.exports.getCloudTopic = function () {
  return 'twain/cloud';
};