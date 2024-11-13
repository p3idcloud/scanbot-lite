import Register from "components/PageComponents/RegisterScanner";
import { destroyCookie, setCookie } from "nookies";
import { authConstants } from "constants/auth";
import { RegisterProvider } from "lib/contexts/registerContext";

const RegisterPage = (props) => (
    <RegisterProvider {...props}>
        <Register />
    </RegisterProvider>
);

export default RegisterPage;

export async function getServerSideProps(ctx) {
    const { registrationToken, callback } = ctx.query;
    // If callback is undefined, destroy the session token cookie
    if (!callback) {
        destroyCookie(ctx, authConstants.SESSION_TOKEN, { path: '/' });
    }

    // Handle registration token
    if (registrationToken) {
        setCookie(ctx, authConstants.REGISTRATION_TOKEN, registrationToken, {
            path: '/',
            sameSite: 'lax',
        });
    }
    
    return {
        props: {}
    }
}