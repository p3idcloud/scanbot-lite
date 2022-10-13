var { ServiceProvider } = require('saml2-js');

const serviceProvider = new ServiceProvider({
    entity_id: process.env.KEYCLOAK_CLIENT_ID,
    private_key: Buffer.from(process.env.KEYCLOAK_SIGNING_PRIVATE_KEY, 'base64'),
    certificate: Buffer.from(process.env.KEYCLOAK_SIGNING_CERT, 'base64'),
    assert_endpoint: process.env.BASE_URL + 'api/auth/signin',
    allow_unencrypted_assertion: true,
    notbefore_skew: 19800,
});

module.exports = { serviceProvider };