'use strict';

const accountService = require("../services/account");
const scanService = require("../services/scanner")
const scannerStateService = require("../services/scannerstate")

exports.getScannersCount = async ( req, res ) => {
    const account = await accountService.getAccountFromId(req.twain.principalId);
    if (!account) {
        return res.status(400).send("Couldn't find account")
    };

    const scannerByOnlineStatus = await scannerStateService.countScannerStateByStatus(false, account.id)
    const scannerByManufacturer = await scanService.countScannerByManufacturer(account.id)
    const allScanner = await scanService.countScanners(account.id)

    return res.send({
        status: [
            {
                total: allScanner - scannerByOnlineStatus[0] ? scannerByOnlineStatus[0].total : 0,
                status: "Offline"
            },
            {
                total: scannerByOnlineStatus[0] ? scannerByOnlineStatus[0].total : 0,
                status: "Online"
            }
        ],
        manufacturer: scannerByManufacturer
    })
}