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
    const maxAgeInDays = parseInt(process.env.LOGIN_SESSION_DAY, 10); // Ensure it's a number
    const maxAgeInMilliseconds = maxAgeInDays * 24 * 60 * 60 * 1000;
    
    res.cookie(SESSION_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: maxAgeInMilliseconds,
        path: '/',
      });
};

// Consolidated /signin route
router.post('/signin', async (req, res) => {
    const samlBody = req.body;

    // Check for registration token
    const registrationToken = req.cookies[REGISTRATION_TOKEN];
    const callbackUrl = registrationToken
        ? `${process.env.FRONTEND_URL}scanners/register?registrationToken=${registrationToken}&callback=true`
        : `${process.env.FRONTEND_URL}dashboard`;

    // Clear the registration token cookie if it exists
    if (registrationToken) {
        res.cookie(REGISTRATION_TOKEN, null, { httpOnly: true, sameSite: 'Lax', expires: new Date() });
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

    res.redirect(callbackUrl)
});

router.post('/verify', (req, res) => {
    var token = req.cookies[SESSION_TOKEN];
    if (!token) {
       token = req.body.token; 
    }

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

router.post('/logout', async (req, res) => {

})

module.exports = router;