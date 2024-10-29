const jwt = require('jsonwebtoken');
const { getScannerFromLoginToken } = require("../services/scanner");
const cache = require('memory-cache');
const authConstants = require('../routes/auth/constants');
const accountService = require('../services/account');

module.exports = async function (req, res, next) {
    var jwtToken
    const whitelistedUrl = [
        '/api/users/token-authenticate',
    ];
    if (whitelistedUrl.indexOf(req.originalUrl) !== -1) {
        return next();
    }

    const cookieToken = req.cookies[authConstants.SESSION_TOKEN]; // From Cookies
    const authorizationToken = req.headers.authorization; // From Authorization Bearer
    if (!authorizationToken && !cookieToken) {
        return res.status(403).json({ error: 'No credentials sent!' });
    } 

    if (cookieToken) {
        jwtToken = cookieToken
    } else if (authorizationToken) {
        jwtToken = authorizationToken
    }

    req.twain = {};
    let plainToken = true;

    if (authorizationToken?.includes("Bearer") || cookieToken) {
        plainToken = false;
            try {
                const decodedToken = jwt.decode(jwtToken);
                if (decodedToken) {
                    const expiredinMS = decodedToken.exp * 1000;
                    const currTime = Date.now();
                    const cacheDuration = expiredinMS - currTime;
                    if (cacheDuration > 0) {
                        cache.put(req.twain.principalId, decodedToken, cacheDuration);
                    }
                    const principalId = decodedToken?.user?.attributes?.userid[0];
                    req.twain.principalId = principalId;

                    var account = await accountService.getAccountFromId(principalId)
                    if (!account) {
                        accountService.createAccount({
                            id: principalId,
                            username: decodedToken?.user?.attributes?.username[0],
                            email: decodedToken?.user?.attributes?.email[0],
                            fullname: decodedToken?.user?.attributes?.firstname[0] + ' ' + decodedToken?.user?.attributes?.lastname[0]
                        })
                    }
                }
            } catch (err) {
                console.error(err);
            }
    } else {
        req.twain.principalId = req.headers.authorization;
    }
    if (plainToken) {
        const scannerFound = await getScannerFromLoginToken(req.twain.principalId);
        if (!scannerFound) {
            return res.status(403).json({ error: 'Invalid credentials!' });
        } else {
            req.twain.principalId = scannerFound.accountId;
        }
    }
    return next();
};