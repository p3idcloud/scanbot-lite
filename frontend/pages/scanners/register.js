import Register from "components/PageComponents/RegisterScanner";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { authConstants } from "constants/auth";
import { RegisterProvider } from "lib/contexts/registerContext";

export default ({...props}) => <RegisterProvider {...props} >
        <Register />
    </RegisterProvider>;

export async function getServerSideProps(ctx) {
    const { registrationToken } = ctx.query;
    // destroyCookie(ctx, authConstants.CALLBACK_URL, {
    //     path: '/'
    // });
    // destroyCookie(ctx, authConstants.SESSION_TOKEN,{
    //     path: '/'
    // });
    // destroyCookie(ctx, authConstants.CSRF_TOKEN,{
    //     path: '/'
    // });
    setCookie(ctx, authConstants.REGISTRATION_TOKEN, registrationToken, {
        path: '/'
    });

    // Check if user is authorized
    const token = parseCookies(ctx)[authConstants.SESSION_TOKEN];
    const { verified } = await fetch(`${process.env.backendUrl}api/auth/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: token})
    }).then(res => res.json());
    
    if (token) {
        return {
            props: {
                user: verified
            }
        }
    }

    return {
        props: {}
    };
}