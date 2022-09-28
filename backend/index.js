'use strict';

require('dotenv').config();
const entry = require('./src/entry');
const port = 80;

// Load scanner settings
const checkAndLoadScannerSettings = async () => {
    const scannerSettingsList = require('./src/lib/config/scannerSettings.json');
    const { insertFromJSON, getAllScannerSettings } = require('./src/services/scannersetting');
    console.log('Checking scanner settings...')
    const scannerSettings = await getAllScannerSettings();
    if (scannerSettings.length === 0) {
        console.log('Loading default settings...')
        await insertFromJSON(scannerSettingsList);
    } else {
        console.log('Settings already loaded...')
    }
}

checkAndLoadScannerSettings()
    .then(_ => {
        entry.app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    });