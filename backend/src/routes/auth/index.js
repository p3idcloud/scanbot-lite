'use-strict';

const {SESSION_TOKEN, CALLBACK_URL, REGISTRATION_TOKEN} = require("./constants");

var { serviceProvider } = require("../../lib/serviceProvider");
var { identityProvider } = require("../../lib/identityProvider");
var Cookies = require('cookies');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/signout', async (req, res) => {
    res.clearCookie(SESSION_TOKEN);
    res.clearCookie(CALLBACK_URL);
    return res.status(200).json('ok');
})

router.get('/signin', async (req, res) => {
    const cookies = new Cookies(req, res);
    var registrationToken = req.query[REGISTRATION_TOKEN];

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
        if (typeof registrationToken !== "undefined") {
            res.cookie(REGISTRATION_TOKEN, registrationToken, { httpOnly: true, sameSite: false });
        }
        return res.redirect(loginUrl);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
})

router.post('/signin', async (req, res, next) => {
    const { ...samlBody } = req.body;
    const cookies = new Cookies(req, res);

    var registrationToken = cookies.get(REGISTRATION_TOKEN);

    // pass in post variables
    res.locals.samlBody = samlBody;
    if (typeof registrationToken !== "undefined") {
        res.locals.callbackUrl = `${process.env.FRONTEND_URL}scanners/register?registrationToken=${registrationToken}&callback=true`
        cookies.set(REGISTRATION_TOKEN, null, { httpOnly: true, sameSite: false, expires: new Date() })
    } else {
        res.locals.callbackUrl = `${process.env.FRONTEND_URL}dashboard`;
    }

    next();
});

router.post('/signin', async (req, res) => {
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
    if (redirectUrl) {
        var cookies = new Cookies(req, res);
        cookies.set('next-auth.session-token', token, {
            httpOnly: true,
            sameSite: 'Lax',  // or 'Strict' based on your security needs
            expires: expireCookie,  // Cookie expiration date
            path: '/', // Define the path
            secure: process.env.NODE_ENV === 'production' // Set 'secure' flag in production
        });

        return res.send(
            `<html>
            <body onload="document.forms['myform'].submit()">
                <form name="myform" action="${process.env.FRONTEND_URL}api/auth/login/saml" method="POST">
                    <input type="hidden" name="sessionToken" value="${token}"/>
                    <input type="hidden" name="expireTime" value="${expireCookie}"/>
                    <input type="hidden" name="redirectUrl" value="${redirectUrl}"/>
                </form>
            </body>
            </html>`
        );
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