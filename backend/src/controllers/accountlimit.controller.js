const userserv = require("../services/user");
const ROLE_CONST = require("../constants/role");
const AccountLimitService = require('../services/accountlimit');
const AccountService = require('../services/account');

exports.insertAccountLimit = async (req,res) => {
    if (req.twain.principalId) {
        const userId = req.twain.principalId;
        if (userId) {
            const user = await userserv.getUserFromUserID(req.twain.principalId)
            if (!user) {
                return res.status(400).send("Couldn't find user")
            }
            //only accessible by systemadmin
            if (!user.role.includes(ROLE_CONST.SYSTEMADMIN)) {
                return res.status(401).send("Higher permission access needed")
            }

            let data = req.body
            data.accountId = user.accountId;

            const result = await AccountLimitService.createAccountLimit(data);
            return res.send(result);
        }
    }

    return res.status(401).send('Can not access this feature. You need to login first!');
}

exports.getAccountLimitsFromQuery = async (req, res) => { //SWR standard
    const user = await userserv.getUserFromUserID(req.twain.principalId)
    if (!user) {
        return res.status(400).send("Couldn't find user")
    }

    //only accessible by systemadmin
    if (!user.role.includes(ROLE_CONST.SYSTEMADMIN)) {
        return res.status(401).send("Higher permission access needed")
    }

    //initial query
    let query = {}

    //find id
    if (req.query.id) {
        query.id = {'$eq' : req.query.id}
    }

    //having regex with case insensitive search will reduce performance on big entries
    //this will not make efficient use of an index and result in all values being scanned for matches.
    if (req.query.name) {
        query.name = {'$regex' : '.*'+req.query.name+'.*', '$options' : '$i'}
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const sort = req.query.sort || "-createdAt"

    const qValues = await AccountLimitService.getAccountLimitsFromQuery(query, page, limit, sort);

    let result = {
        data: qValues.retValue,
        dataCount: qValues.count,
        currentPage: page,
        pages: Math.ceil(qValues.count/limit),
        query: query
    }

    return res.send(result)
}

exports.updateAccountLimitFromId = async (req, res) => {
    const user = await userserv.getUserFromUserID(req.twain.principalId);
    if (!user) {
        return res.status(400).send("Couldn't find user");
    }

    //only these roles can access
    if (!user.role.includes(ROLE_CONST.SYSTEMADMIN)){
        return res.status(401).send("Higher permission access needed")
    }

    const id = req.params.id;
    const body = req.body
    const result = await AccountLimitService.updateAccountLimitFromId(id,body)

    return res.send(result)
}