import Cookies from "cookies";
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import {serviceProvider} from "src/lib/serviceProvider";
import {identityProvider} from "src/lib/identityProvider";
import { authConstants } from "constants/auth";

export default async (req, res) => {
    const cookies = new Cookies(req, res)
    if (req.method === "POST") {
        const encodedSAMLBody = encodeURIComponent(JSON.stringify(req.body));

        let redirectUrl = req.body.callbackUrl;
        let csrfToken = req.body.csrfToken;
        let csrfTokenHash = req.body.csrfTokenHash;
        const expectedCsrfTokenHash = crypto.createHash('sha256').update(`${csrfToken}${process.env.APP_SECRET_STRING}`).digest('hex');
        if (csrfTokenHash === expectedCsrfTokenHash) {
            // If hash matches then we trust the CSRF token value
            // If this is a POST request and the CSRF Token in the POST request matches
            // the cookie we have already verified is the one we have set, then the token is verified!

            req.options = {};
            req.options.csrfToken = csrfToken;
            req.options.csrfTokenVerified = true;

            let samlBody = JSON.parse(decodeURIComponent(req.body.samlBody));
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


            // console.log('ENV:', process.env.JWT_SECRET);
            //generate jwt
            var token = await jwt.sign({ user }, process.env.JWT_SECRET, {expiresIn: process.env.LOGIN_SESSION_DAY+'d'});

            //now set the session cookie
            let expireCookie = new Date();
            expireCookie.setDate(expireCookie.getDate() + process.env.LOGIN_SESSION_DAY);
            if (redirectUrl.includes('register')){
                cookies.set(authConstants.SESSION_TOKEN, token, {
                    sameSite: 'lax',
                    expires: expireCookie,
                    httpOnly: false
                });
            }else {
                cookies.set(authConstants.SESSION_TOKEN, token, {
                    sameSite: 'lax',
                    expires: expireCookie
                });
            }
            if (redirectUrl){
                if (redirectUrl.includes('register')){
                    return res.redirect(302, process.env.baseUrl+redirectUrl);
                } else {
                    return res.redirect(process.env.baseUrl+redirectUrl);
                }
            }
            return res.redirect(process.env.baseUrl)
        } else {
            return res.status(401).send({message: 'CSRF token cannot be verified!'});
        }
    }
};