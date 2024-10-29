import Register from "components/PageComponents/RegisterScanner";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { authConstants } from "constants/auth";
import { RegisterProvider } from "lib/contexts/registerContext";
import { fetchData } from "lib/fetch";

const RegisterPage = (props) => (
    <RegisterProvider {...props}>
        <Register />
    </RegisterProvider>
);

export default RegisterPage;

export async function getServerSideProps(ctx) {
    const { registrationToken, callback } = ctx.query;
    const cookies = parseCookies(ctx);
    let token = cookies[authConstants.SESSION_TOKEN];

    // If callback is undefined, destroy the session token cookie
    if (!callback) {
        destroyCookie(ctx, authConstants.SESSION_TOKEN, { path: '/' });
        token = null;
    }

    // Handle registration token
    if (registrationToken) {
        setCookie(ctx, authConstants.REGISTRATION_TOKEN, registrationToken, {
            path: '/',
            sameSite: 'lax',
        });
    } else {
        ctx.res.writeHead(302, {
            Location: "/dashboard",
        });
        return ctx.res.end();
    }

    // Check if user is authorized
    if (token) {
        try {
            const apiURL = `${(process.env.SAME_DOMAIN === 'false' ? process.env.BACKEND_URL : process.env.BASE_URL)}api/auth/verify`
            const { verified } = await fetchData(apiURL, {
                method: 'POST',
                body: {
                    token: token
                },
            });
            
            return {
                props: {
                    user: verified,
                },
            };
        } catch (error) {
            console.error('Error verifying token:', error);
            return {
                props: {
                    user: false,
                },
            };
        }
    }

    return {
        props: {
            user: false,
        },
    };
}