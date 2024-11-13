import { authConstants } from "constants/auth";
import Cookies from "js-cookie";
import Head from "next/head";

const Signin = () => {
    return (
        <div>
            <Head>
                <title>Scanbot Login</title>
            </Head>
            {/* Return null or a loading indicator while redirecting */}
            <div>Loading...</div>
        </div>
    );
};

// This gets called on every request
export async function getServerSideProps({ req, res }) {
    const registrationToken = Cookies.get(authConstants.REGISTRATION_TOKEN);
    if (registrationToken) {
        return {
            redirect: {
                destination: `/api/auth/signin?${authConstants.REGISTRATION_TOKEN}=${registrationToken}`,
                permanent: false,
            },
        };
    } else {
        return {
            redirect: {
                destination: `/api/auth/signin`,
                permanent: false,
            },
        };
    }
}

export default Signin;