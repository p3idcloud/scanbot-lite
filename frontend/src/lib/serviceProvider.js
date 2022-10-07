import { ServiceProvider } from 'saml2-js';
import { clientId, signingPrivateKey, signingCertificate } from '../../keycloak.config';

export const serviceProvider = new ServiceProvider({
    entity_id: clientId,
    private_key: Buffer.from(signingPrivateKey, 'base64'),
    certificate: Buffer.from(signingCertificate, 'base64'),
    assert_endpoint: process.env.baseUrl + 'api/auth/login/saml',
    allow_unencrypted_assertion: true,
    notbefore_skew: 19800,
});