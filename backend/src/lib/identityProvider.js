var IdentityProvider = require('saml2-js').IdentityProvider;

const identityProvider = new IdentityProvider({
    sso_login_url: process.env.SSO_LOGIN_URL,
    sso_logout_url: process.env.SSO_LOGIN_URL + '?slo=true',
    certificates: [
        Buffer.from(process.env.IDP_CERT_B64, 'base64').toString('utf8')
    ]
});

module.exports = identityProvider;