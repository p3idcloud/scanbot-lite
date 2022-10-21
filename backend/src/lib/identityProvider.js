var { IdentityProvider } = require('saml2-js');

const identityProvider = new IdentityProvider({
    sso_login_url: process.env.KEYCLOAK_SSO_LOGIN_URL,
    sso_logout_url: process.env.KEYCLOAK_SSO_LOGIN_URL,
    certificates: process.env.KEYCLOAK_IDP_CERT,
});

module.exports = { identityProvider };