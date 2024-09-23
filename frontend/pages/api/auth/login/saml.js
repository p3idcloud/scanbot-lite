import { authConstants } from "constants/auth";
import { serialize, parse } from "cookie";

export default async (req, res) => {
    if (req.method === 'GET') {
        const cookies = parse(req.headers.cookie ?? '');
        const registrationToken = cookies[authConstants.REGISTRATION_TOKEN];
        if (registrationToken) {
            return res.redirect(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/signin?${authConstants.REGISTRATION_TOKEN}=${registrationToken}`);
        } else {
            return res.redirect(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/signin`);
        }
    }
    if (req.method === 'POST') {
        const { sessionToken, expireTime, redirectUrl } = req.body;
        if (sessionToken && expireTime && redirectUrl) {
            var cookie = serialize(authConstants.SESSION_TOKEN, sessionToken, {
                httpOnly: true,
                sameSite: false,
                expires: new Date(expireTime),
                path: '/'
            });
            res.setHeader('Set-Cookie', cookie);
            return res.redirect(decodeURI(redirectUrl));
        }
    }
    
    return res.status(400).send("NOT FOUND");
};
