const {getScannersFromQuery} = require("../services/scanner");
const {getScannerStateFromQuery} = require("../services/scannerstate");
exports.getServiceStatus = async (req, res, next) => {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + Buffer.from(process.env.EMQ_USERNAME + ":" + process.env.EMQ_PASSWORD).toString('base64'));

    const response = await fetch(process.env.EMQ_ENDPOINT + '/api/v4/nodes', {method: 'GET', headers: headers});
    const mqttStats = await response.json()

    let retValue = {};

    let noOfConnections = 0;

    let nodeUptime = {};

    function countTotalMqttConnections(data) {
        objectssda = data.node
        aptem = data.uptime
        nodeUptime = { ...nodeUptime, [objectssda]: aptem }
        noOfConnections += data.connections
    }
    
    mqttStats.data.forEach(countTotalMqttConnections)

    scannerStateQuery = {
        "$and": [
            {"status": {"$ne": "error"}},
            {"status": {"$ne": "offline"}}
        ]
    }
    const activeScanners = await getScannerStateFromQuery(scannerStateQuery, 1,1,'scannerId');

    retValue.activeScanners = activeScanners.count;
    retValue.mqttNodes = mqttStats.data.length;
    retValue.uptime = nodeUptime;
    retValue.mqttNumberOfConnections = noOfConnections;
    retValue.databaseConn = process.env.MONGODB_URL;

    return res.send(retValue);
}