'use-strict';

const {SESSION_TOKEN, CALLBACK_URL, CSRF_TOKEN} = require("./constants");

var serviceProvider = require("../../lib/serviceProvider");
var identityProvider = require("../../lib/identityProvider");
var Cookies = require('cookies');
var express = require('express');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/signout', async (req, res) => {
    res.clearCookie(SESSION_TOKEN);
    res.clearCookie(CALLBACK_URL);
    res.clearCookie(CSRF_TOKEN);
    return res.status(200).json('ok');
})

router.get('signin', async (req, res) => {
    const createLoginRequestUrl = (identityProvider, options = {}) =>
        new Promise((resolve, reject) => {
            serviceProvider.create_login_request_url(
                identityProvider,
                options,
                (error, loginUrl) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(loginUrl);
                }
            );
        });

    try {
        const loginUrl = await createLoginRequestUrl(identityProvider, { force_authn: true });
        return res.redirect(loginUrl);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
})

router.post('/signin', async (req, res, next) => {
    const encodedSAMLBody = encodeURIComponent(JSON.stringify(req.body));
    const csrfToken = crypto.randomBytes(32).toString('hex');
    const csrfTokenHash = crypto.createHash('sha256').update(`${csrfToken}${process.env.APP_SECRET_STRING}`).digest('hex');
    const csrfTokenCookie = `${csrfToken}|${csrfTokenHash}`;

    res.setHeader(
        'set-cookie', 
        [
            `${CSRF_TOKEN}=${encodeURIComponent(csrfTokenCookie)}; Path=/; HttpOnly; SameSite=Lax'`, 
            `${CALLBACK_URL}=${encodeURIComponent(process.env.baseUrl)+'/dashboard'}; Path=/; SameSite=Lax`
        ]
    );

    // pass in post variables
    res.locals.csrfToken = csrfToken;
    res.locals.csrfTokenHash = csrfTokenHash;
    res.locals.encodedSAMLBody = encodedSAMLBody;
    res.locals.callbackUrl = `${process.env.FRONTEND_URL}dashboard`;

    next();
});

router.post('/signin', async (req, res) => {
    const cookies = new Cookies(req, res);
    const redirectUrl = req.locals.callbackUrl;
    const csrfToken = req.locals.csrfToken;
    const csrfTokenHash = req.locals.csrfTokenHash;
    const expectedCsrfTokenHash = crypto.createHash('sha256').update(`${csrfToken}${process.env.APP_SECRET_STRING}`).digest('hex');
    if (csrfTokenHash === expectedCsrfTokenHash) {
        // If hash matches then we trust the CSRF token value
        // If this is a POST request and the CSRF Token in the POST request matches
        // the cookie we have already verified is the one we have set, then the token is verified!

        req.options = {};
        req.options.csrfToken = csrfToken;
        req.options.csrfTokenVerified = true;

        const samlBody = JSON.parse(decodeURIComponent(req.locals.samlBody));
        let user;

        const postAssert = (identityProvider, samlBody) =>
            new Promise((resolve, reject) => {
                serviceProvider.post_assert(
                    identityProvider,
                    {
                        request_body: samlBody,
                    },
                    (error, response) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(response);
                    }
                );
            });

        try {
            const postresponse = await postAssert(identityProvider, samlBody);
            user = postresponse.user;
        } catch (error) {
            console.error(error);
            return res.status(401).send({message: 'SAML identity error!'});
        }

        //generate jwt
        var token = await jwt.sign({ user }, process.env.JWT_SECRET, {expiresIn: process.env.LOGIN_SESSION_DAY+'d'});

        //now set the session cookie
        let expireCookie = new Date();
        expireCookie.setDate(expireCookie.getDate() + process.env.LOGIN_SESSION_DAY);
        if (redirectUrl.includes('register')){
            cookies.set(SESSION_TOKEN, token, {
                sameSite: 'lax',
                expires: expireCookie,
                httpOnly: false
            });
        }else {
            cookies.set(SESSION_TOKEN, token, {
                sameSite: 'lax',
                expires: expireCookie
            });
        }
        if (redirectUrl){
            if (redirectUrl.includes('register')){
                return res.redirect(302, process.env.FRONTEND_URL+redirectUrl);
            } else {
                return res.redirect(process.env.FRONTEND_URL+redirectUrl);
            }
        }
        return res.redirect(process.env.BASE_URL)
    } else {
        return res.status(401).send({message: 'CSRF token cannot be verified!'});
    }
});

module.exports = router;