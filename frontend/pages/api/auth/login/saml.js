import { authConstants } from "constants/auth";
import { serialize } from "cookie";

export default async (req, res) => {
    if (req.method === 'GET') {
        return res.redirect(`${process.env.backendUrl}api/auth/signin`);
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
            console.log(cookie);
            res.setHeader('Set-Cookie', cookie);
            return res.redirect(redirectUrl);
        }
    }
    
    return res.status(400).send("NOT FOUND");
};
