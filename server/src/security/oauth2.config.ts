import { config } from '../config';

const issuerUri = config.get('jhipster.security.oauth2.client.provider.oidc.issuer-uri');
const port = process.env.NODE_SERVER_PORT || config.get('server.port');
const callback = `http://localhost:${port}/login/oauth2/code/oidc`;
const dockerIssuerUri = process.env.NODE_CLIENT_PROVIDER_OIDC_ISSUER_URI || issuerUri;
const openIdProtocol = 'protocol/openid-connect';

let oauth2Config = {
    authorizationURL: `${issuerUri}/${openIdProtocol}/auth`,
    tokenURL: `${dockerIssuerUri}/${openIdProtocol}/token`,
    logoutUrl: `${issuerUri}/${openIdProtocol}/logout`,
    callbackURL: callback,
    isOktaProvider: false,
};

if (issuerUri.includes('okta')) {
    oauth2Config = {
        authorizationURL: `${issuerUri}/v1/authorize`,
        tokenURL: `${issuerUri}/v1/token`,
        logoutUrl: `${issuerUri}/v1/logout`,
        callbackURL: callback,
        isOktaProvider: true,
    };
}

export { oauth2Config };
