import { IdentityProvider } from 'saml2-js';
import { authenticationEndpoint, identityProviderX509Certificate, requireClientSignature } from '../../keycloak.config';

export const identityProvider = new IdentityProvider({
    sso_login_url: authenticationEndpoint,
    sso_logout_url: authenticationEndpoint,
    certificates: identityProviderX509Certificate,
    sign_get_request: requireClientSignature,
});