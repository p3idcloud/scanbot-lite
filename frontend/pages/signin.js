import { useEffect } from "react";
import { authConstants } from "constants/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Head from "next/head";

const Signin = () => {
    const router = useRouter();
    const registrationToken = Cookies.get(authConstants.REGISTRATION_TOKEN);

    useEffect(() => {
        // Check if the registration token exists and navigate accordingly
        if (registrationToken) {
            router.push(`/api/auth/signin?${authConstants.REGISTRATION_TOKEN}=${registrationToken}`);
        } else {
            router.push(`/api/auth/signin`);
        }
    }, [registrationToken, router]); // Dependency array to run effect when registrationToken changes

    return <Head>
         <title>Scanbot Login</title>
    </Head>; // Return null or a loading indicator while redirecting
}

export default Signin;