import fs from 'fs';
import { ServiceProvider } from 'saml2-js';

export const serviceProvider = new ServiceProvider({
    entity_id: 'saml-prod',
    private_key: fs.readFileSync(process.cwd() + '\\src\\certs\\key.pem').toString(),
    certificate: fs.readFileSync(process.cwd() + '\\src\\certs\\cert.pem').toString(),
    assert_endpoint: process.env.baseUrl + 'api/auth/login/saml',
    allow_unencrypted_assertion: true,
    notbefore_skew: 19800,
});
