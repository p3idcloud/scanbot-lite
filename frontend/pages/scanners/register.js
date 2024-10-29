import Register from "components/PageComponents/RegisterScanner";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { authConstants } from "constants/auth";
import { RegisterProvider } from "lib/contexts/registerContext";
import { fetchData } from "lib/fetch";

export default ({...props}) => <RegisterProvider {...props} >
        <Register />
    </RegisterProvider>;

export async function getServerSideProps(ctx) {
    const { registrationToken, callback } = ctx.query;

    var token = parseCookies(ctx)[authConstants.SESSION_TOKEN];

    if (typeof callback === 'undefined') {
        destroyCookie(ctx, authConstants.SESSION_TOKEN,{
            path: '/'
        });
        token = null;
    }
    if (registrationToken && registrationToken !== 'undefined') {
        setCookie(ctx, authConstants.REGISTRATION_TOKEN, registrationToken, {
            path: '/',
            sameSite: 'lax'
        });
    } else {
        ctx.res.writeHead(302, {
            Location: "/dashboard",
        });
  
      return ctx.res.end();
    }
    
    if (token) {
        // Check if user is authorized
        const { verified } = await fetchData(`api/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token: token})
        })
        
        return {
            props: {
                user: verified
            }
        }
    }

    return {
        props: {
            user: false
        }
    };
}