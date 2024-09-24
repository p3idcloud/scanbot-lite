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
                        console.log(error)
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

// Helper function to handle SAML assertion
const postAssert = (identityProvider, samlBody) =>
    new Promise((resolve, reject) => {
        serviceProvider.post_assert(identityProvider, { request_body: samlBody }, (error, response) => {
            if (error) {
                return reject(error);
            }
            return resolve(response);
        });
    });

// Helper function to set session token as a cookie
const setSessionCookie = (req, res, token) => {
    const cookies = new Cookies(req, res);
    let expireCookie = new Date();
    expireCookie.setDate(expireCookie.getDate() + parseInt(process.env.LOGIN_SESSION_DAY, 10));

    cookies.set(SESSION_TOKEN, token, {
        httpOnly: true,
        sameSite: 'Lax',  // 'Strict' can be used if necessary
        expires: expireCookie,
        path: '/',
        // secure: process.env.NODE_ENV === 'production'
        secure: false
    });
};

// Consolidated /signin route
router.post('/signin', async (req, res) => {
    const samlBody = req.body;
    const cookies = new Cookies(req, res);
    let user;

    // Check for registration token
    const registrationToken = cookies.get(REGISTRATION_TOKEN);
    const callbackUrl = registrationToken
        ? `${process.env.FRONTEND_URL}scanners/register?registrationToken=${registrationToken}&callback=true`
        : `${process.env.FRONTEND_URL}dashboard`;

    // Clear the registration token cookie if it exists
    if (registrationToken) {
        cookies.set(REGISTRATION_TOKEN, null, { httpOnly: true, sameSite: 'Lax', expires: new Date() });
    }

    try {
        // Handle SAML assertion and get user info
        const postResponse = await postAssert(identityProvider, samlBody);
        user = postResponse.user;
    } catch (error) {
        console.error('SAML identity error:', error);
        return res.status(401).json({ message: 'SAML identity error!' });
    }

    // Generate JWT token
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: `${process.env.LOGIN_SESSION_DAY}d` });

    // Set the session cookie
    setSessionCookie(req, res, token);

    // Redirect to the appropriate URL
    return res.send(`
        <html>
            <body onload="document.forms['myform'].submit()">
                <form name="myform" action="${process.env.FRONTEND_URL}api/auth/login/saml" method="POST">
                    <input type="hidden" name="sessionToken" value="${token}"/>
                    <input type="hidden" name="expireTime" value="${new Date(Date.now() + process.env.LOGIN_SESSION_DAY * 24 * 60 * 60 * 1000).toISOString()}"/>
                    <input type="hidden" name="redirectUrl" value="${callbackUrl}"/>
                </form>
            </body>
        </html>
    `);
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