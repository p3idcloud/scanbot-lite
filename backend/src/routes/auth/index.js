'use-strict';

const {SESSION_TOKEN, CALLBACK_URL, CSRF_TOKEN} = require("./constants");

var { serviceProvider } = require("../../lib/serviceProvider");
var { identityProvider } = require("../../lib/identityProvider");
var Cookies = require('cookies');
var express = require('express');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/signout', async (req, res) => {
    res.clearCookie(SESSION_TOKEN);
    res.clearCookie(CALLBACK_URL);
    return res.status(200).json('ok');
})

router.get('/signin', async (req, res) => {
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
        return res.status(500);
    }
})

router.post('/signin', async (req, res, next) => {
    const { registrationToken, ...samlBody } = req.body;

    // pass in post variables
    res.locals.samlBody = samlBody;
    if (registrationToken) {
        res.locals.callbackUrl = `${process.env.FRONTEND_URL}scanners/register?registrationToken=${registrationToken}`
    } else {
        res.locals.callbackUrl = `${process.env.FRONTEND_URL}dashboard`;
    }

    next();
});

router.post('/signin', async (req, res) => {
    const cookies = new Cookies(req, res);
    const redirectUrl = res.locals.callbackUrl;

    const samlBody = res.locals.samlBody;
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
    } else {
        cookies.set(SESSION_TOKEN, token, {
            sameSite: 'lax',
            expires: expireCookie
        });
    }
    if (redirectUrl){
        return res.redirect(302, redirectUrl);
    }
    return res.redirect(process.env.BASE_URL);
});

router.post('/verify', (req, res) => {
    const { token } = req.body;
    if (token) {
        try {
            const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
            return res.status(200).send({verified: true});
        } catch (e) {
            return res.status(200).send({verified: false});
        }
    } 
    res.status(200).send({verified: false});
})

module.exports = router;