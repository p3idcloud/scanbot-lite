const jwt = require('jsonwebtoken');
const { getScannerFromLoginToken } = require("../services/scanner");
const cache = require('memory-cache');

module.exports = async function (req, res, next) {
    const whitelistedUrl = [
        '/api/users/token-authenticate',
    ];
    if (whitelistedUrl.indexOf(req.originalUrl) !== -1) {
        return next();
    }

    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }

    req.twain = {};
    let plainToken = true;
    if (req.headers.authorization.includes("Bearer")) {
        plainToken = false;
        let decodedToken;
        req.twain.principalId = req.headers.authorization.split(' ')[1];
        decodedToken = cache.get(req.twain.principalId);
        if (!decodedToken) {
            try {
                decodedToken = jwt.decode(req.twain.principalId);
                if (decodedToken) {
                    const expiredinMS = decodedToken.exp * 1000;
                    const currTime = Date.now();
                    const cacheDuration = expiredinMS - currTime;
                    if (cacheDuration > 0) {
                        cache.put(req.twain.principalId, decodedToken, cacheDuration);
                    }
                    req.twain.principalId = decodedToken?.user?.attributes?.userid[0];
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            const decodedTokenNew = jwt.decode(req.twain.principalId);
            if (decodedTokenNew.id != decodedToken.id) {
                const expiredinMS = decodedTokenNew.exp * 1000;
                const currTime = Date.now();
                const cacheDuration = expiredinMS - currTime;
                if (cacheDuration > 0){
                    cache.put(req.twain.principalId, decodedTokenNew, cacheDuration);
                }
                req.twain.principalId = decodedTokenNew?.user?.attributes?.userid[0];
            } else {
                req.twain.principalId = decodedToken?.user?.attributes?.userid[0];
            }
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