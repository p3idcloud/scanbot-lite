import { ServiceProvider } from 'saml2-js';

export const serviceProvider = new ServiceProvider({
    entity_id: process.env.KEYCLOAK_CLIENT_ID,
    private_key: Buffer.from(process.env.KEYCLOAK_SIGNING_PRIVATE_KEY, 'base64'),
    certificate: Buffer.from(process.env.KEYCLOAK_SIGNING_CERT, 'base64'),
    assert_endpoint: process.env.baseUrl + 'api/auth/login/saml',
    allow_unencrypted_assertion: true,
    notbefore_skew: 19800,
});