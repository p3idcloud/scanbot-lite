import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { identityProvider } from 'lib/identityProvider';
import { serviceProvider } from 'lib/serviceProvider';
import { authConstants } from 'constants/auth';

// https://docs.wso2.com/display/IS560/Configuring+Claims+for+a+Service+Provider
export default NextAuth({
    providers: [
        Providers.Credentials({
            id: 'saml',
            name: 'SAML',
            authorize: async ({ samlBody }) => {
                samlBody = JSON.parse(decodeURIComponent(samlBody));
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
                    const { user } = await postAssert(identityProvider, samlBody);
                    return user;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            },
        }),
    ],
    useSecureCookies: false, 
    pages: {
        signIn: '/signin'
    },
    session: {
        jwt: true,
        maxAge: 600000
    },
    jwt: {
        //must change this later so can authorize in middleware on expressjs later
        // secret: 'a secret',
        // signingKey: {
        //     kty: "oct",
        //     kid: "Dl893BEV-iVE-x9EC52TDmlJUgGm9oZ99_ZL025Hc5Q",
        //     alg: "HS512",
        //     k: "K7QqRmJOKRK2qcCKV_pi9PSBv3XP0fpTu30TP8xn4w01xR3ZMZM38yL2DnTVPVw6e4yhdh0jtoah-i4c_pZagA"
        // },
    },
    secret: process.env.APP_SECRET_STRING,
    options: {
        useSecureCookies: false
    },
    cookies: {
        sessionToken: {
            name: authConstants.SESSION_TOKEN,
            options: {
                httpOnly: false,
                sameSite: 'lax',
                path: '/',
                secure: false
            }
        },
        callbackUrl: {
            name: authConstants.CALLBACK_URL,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: false
            }
        },
        csrfToken: {
            name: authConstants.CSRF_TOKEN,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false
            }
        },
        pkceCodeVerifier: {
            name: `next-auth.pkce.code_verifier`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false
            }
        }
    },
    callbacks: {
        jwt: (token, user) => {
            if (user) {
                return {
                    user,
                };
            }

            return token;
        },
        session: (session, { user }) => {
            return {
                ...session,
                user,
            };
        },
        redirect: async (url, baseUrl) => {
            if (url.includes('register')) {
                return Promise.resolve(baseUrl  + url);
            } else {
                return Promise.resolve(baseUrl);
            }
        },
    },
});
