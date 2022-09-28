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
    if (req.headers.authorization.includes("Bearer")) {
        /**
         * {
user: {
    name_id: 'kneal',
    session_index: 'd3f92d09-380a-4247-bd9e-523dad63d71f',
    attributes: {
      firstname: [Array],
      userid: [Array],
      email: [Array],
      username: [Array],
      lastname: [Array]
    }
  },
  iat: 1663933036,
  exp: 1664537836
}
         */
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

        // console.log(req.twain.principalId);
    } else {
        req.twain.principalId = req.headers.authorization;
    }

    return next();
};