import { IdentityProvider } from 'saml2-js';

export const identityProvider = new IdentityProvider({
    sso_login_url: process.env.KEYCLOAK_SSO_LOGIN_URL,
    sso_logout_url: process.env.KEYCLOAK_SSO_LOGIN_URL,
    certificates: process.env.KEYCLOAK_IDP_CERT,
    sign_get_request: process.env.REQUIRE_CLIENT_SIGNATURE === 'true',
});