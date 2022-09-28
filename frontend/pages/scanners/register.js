import Register from "components/PageComponents/RegisterScanner";
import { parseCookies, setCookie } from "nookies";
import { authConstants } from "constants/auth";
import jwt from 'jsonwebtoken';
import { RegisterProvider } from "lib/contexts/registerContext";

export default ({...props}) => <RegisterProvider {...props} >
        <Register />
    </RegisterProvider>;

export function getServerSideProps(ctx) {
    const { registrationToken } = ctx.query;
    setCookie(ctx, authConstants.REGISTRATION_TOKEN, registrationToken, {
        path: '/'
    });

    // Check if user is authorized
    const token = parseCookies(ctx)[authConstants.SESSION_TOKEN];
    if (token) {
        try {
            const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
            return {
                props: {
                    user: verifiedUser
                }
            };
        } catch (e) {
            // User not authorized
            return {
                props: {
                    user: null
                }
            };
        }
    }
    return {
        props: {}
    };
}