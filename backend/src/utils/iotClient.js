'use strict';

const uuid = require('uuid');
const mqtt = require('mqtt');
const {updateScannerSessionFromId, getScannerSessionFromId} = require("../services/scannersession");
const scannerStateService = require("../services/scannerstate");
const scannerService = require("../services/scanner");
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

// askScannerToUploadImageBlock = async () => {
  
// }
module.exports.findPollCommandIdFromWaitForEventsThenSaveImagesToService = async (aheaders, scannerId, topic, sessionId) => {
  const currScanner = await scannerService.getScannerFromId(scannerId);
  //do a polling to send : waitForEvents
  //save timenow @the first time ppl throw a startSession command << is in queue.startDate
  //
  if (!mqttWaitEventsClient){
    mqttWaitEventsClient = mqtt.connect(process.env.MQTT_ENDPOINT);
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
    if (parsedBody.method == 'waitForEvents' || parsedBody.method == 'readImageBlock'){
      waitEventsContainer[topicPlus][requestId] = parsedBody;
    }
  });
  
  let sessionRevision = 1;
  let uploadedImageBlock = [];
  let weDoneYet = false;
  let startTime = Date.now();
  const scannerSession = await getScannerSessionFromId(sessionId);
  let oneMoreTry = false;

  while(!weDoneYet){ //keep polling this until condition :
    const commandId = uuid.v4();
    let headers = aheaders;
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
              /*
              if ( waitContainerFound.results.code && waitContainerFound.results.code === 'timeout' ){
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
              */
              if (waitContainerFound == null) { //if after 100 seconds we got nothing
                if (oneMoreTry==false) {
                  exports.notifyScanner(scannerId, {
                    headers, //headers
                    method,
                    url,
                    body: JSON.stringify(body)
                  });
                  oneMoreTry == true;
                }
                else {
                  mqttWaitEventsClient.end();
                  weDoneYet=true;
                  return
                }
              }
              if (waitContainerFound?.results.code === 'invalidSessionId') {
                mqttWaitEventsClient.end();
                weDoneYet=true;
                return
              }
              if ( waitContainerFound?.results.events && waitContainerFound.results.events[0] && waitContainerFound.results.events[0].session.imageBlocks && waitContainerFound.results.events[0].session.imageBlocks != [] ) {
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

                let resultImageUpload = {};
                for (const item of waitContainerFound.results.events[0].session.imageBlocks){
                  //console.log("getting image:"+ item);
                  if (!uploadedImageBlock.includes(item)){
                    const commandIdReadImage = uuid.v4();
                    let headers = aheaders;
                    headers['x-twain-cloud-request-id'] = commandIdReadImage;
                    let bodyReadImageBlock = {
                      "kind": "twainlocalscanner",
                      "commandId": commandIdReadImage,
                      "method": "readImageBlock",
                      "params": {
                        "imageBlockNum": item,
                        "sessionId": sessionId,
                        "withImageBlockUrl": true,
                        "withMetadata": false
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
                    //TODO:: also update scannersession and scanner state..

                    await updateScannerSessionFromId(scannerSession.id,{
                      'state': resultImageUpload.results.session.state,
                      'revision': resultImageUpload.results.session.revision,
                      'imageBlocks': resultImageUpload.results.session.imageBlocks
                    })

                    await scannerStateService.updateScannerState(scannerId,
                        {
                          "state": resultImageUpload.results.session.state,
                          "status": resultImageUpload.results.session.status.detected,
                          "latestEvent": resultImageUpload.method,
                          "lastCommandAt": Date.now()
                        }
                    );

                    uploadedImageBlock.push(item);
                  }
                }
                console.log(resultImageUpload);
                //stop capture & release image block if all paper has been captured
                if((uploadedImageBlock.length > 0 && JSON.stringify(uploadedImageBlock) == JSON.stringify(waitContainerFound.results.events[0].session.imageBlocks)
                    && waitContainerFound.results.events[0].session.doneCapturing === true ) || ( uploadedImageBlock.length > 0
                    && JSON.stringify(resultImageUpload) !== '{}'
                    && JSON.stringify(uploadedImageBlock) === JSON.stringify(resultImageUpload.results.session.imageBlocks)
                    && resultImageUpload.results.session.doneCapturing === true ) ){
                  // Stop capturing
                  const commandIdStopCapturing = uuid.v4();
                  let headers = aheaders;
                  headers['x-twain-cloud-request-id'] = commandIdStopCapturing;
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


                  //release image blocks
                  const commandIdReleaseImageBlock = uuid.v4();
                  headers['x-twain-cloud-request-id'] = commandIdReleaseImageBlock;
                  let bodyReleaseImageBlocks = {
                    "kind": "twainlocalscanner",
                    "commandId": commandIdReleaseImageBlock,
                    "method": "releaseImageBlocks",
                    "params": {
                      "sessionId": sessionId,
                      "imageBlockNum": uploadedImageBlock[0],
                      "lastImageBlockNum": (uploadedImageBlock.length-1) === 0 ? uploadedImageBlock[0] : uploadedImageBlock[uploadedImageBlock.length-1]
                    }
                  };
                  if (currScanner.manufacturer === 'Xerox') {
                    bodyReleaseImageBlocks.params.lastImageBlockNum = -1;
                  }

                  //ask scanner to releaseImageBlocks
                  //halt awhile before asking scanner to drain images...
                  exports.notifyScanner(scannerId, {
                    headers, //headers
                    method,
                    url,
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

                  uploadedImageBlock = [];

                }
              }
          } catch (error) {
            console.log(error);
            weDoneYet=true;
          }
      //  }
      //}

      const dbState = await scannerStateService.getScannerStateFromScannerId(scannerId);
      if (dbState.sessionId == "")
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
  return null
};

module.exports.printGlobalMessageContainer = () => {
  console.log(messageContainer);
}

const publishMqttMessage = function(message) {
  var client = mqtt.connect(process.env.MQTT_ENDPOINT);
  return new Promise((resolve, reject) => {
    client.publish(message.topic, message.payload, { qos: message.qos, retain: message.retain }, (err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
};

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
module.exports.getClientTopic = function (accountId) {
  return `twain/accounts/${accountId}/+`;
};

module.exports.getDeviceRequestTopic = function (scannerId) {
  return `twain/devices/${scannerId}`;
};

module.exports.getDeviceResponseTopic = function (accountId) {
  // TODO: ideally, it would be session ID. Let's think about this a bit.
  const randomTopicId = uuid.v4();
  
  return `twain/accounts/${accountId}/${randomTopicId}`;
};

module.exports.getCloudTopic = function () {
  return 'twain/cloud';
};