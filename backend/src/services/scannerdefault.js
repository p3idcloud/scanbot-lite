const mongo = require('../models');
const ScannerDefault = mongo.db.scannerdefault;

exports.getScannerDefaultFromUserAccountID = async (userId, accountId) => {
    try {
        let scannerDefault = await ScannerDefault.findOne({"userId":userId,"accountId":accountId}).exec();

        if (!scannerDefault) {
            scannerDefault = {"userId":userId,"accountId":accountId,"scannerId":""};
            scannerDefault = ScannerDefault(scannerDefault).save()
        }

        return scannerDefault
    } catch (e) {
        console.log(e);
    }
}

exports.updateScannerDefaultFromUserAccountId = async (userId, accountId, scannerId) => {
    try {
        const retValue = await ScannerDefault.updateOne({"userId":userId,"accountId":accountId}, {"scannerId":scannerId}).exec();
        if (retValue.nModified!=0){
            return {
                "userId":userId,
                "accountId":accountId,
                "scannerId":scannerId
            }
        }

        return {"error":"No value modified."};
    } catch (e) {
        console.log(e);
    }
}