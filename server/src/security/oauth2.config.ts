import { config } from '../config';

const issuerUri = config.get('jhipster.security.oauth2.client.provider.oidc.issuer-uri');
const port = process.env.NODE_SERVER_PORT || config.get('server.port');
const callback = `http://localhost:${port}/login/oauth2/code/oidc`;
const dockerIssuerUri = process.env.NODE_CLIENT_PROVIDER_OIDC_ISSUER_URI || issuerUri;

let oauth2Config = {
  authorizationURL: `${issuerUri}/protocol/openid-connect/auth`,
  tokenURL: `${dockerIssuerUri}/protocol/openid-connect/token`,
  logoutUrl: `${issuerUri}/protocol/openid-connect/logout`,
  callbackURL: callback,
  isOktaProvider: false
};

if (issuerUri.includes('okta')) {
  oauth2Config = {
    authorizationURL: `${issuerUri}/v1/authorize`,
    tokenURL: `${issuerUri}/v1/token`,
    logoutUrl: `${issuerUri}/v1/logout`,
    callbackURL: callback,
    isOktaProvider: true
  };
}

export { oauth2Config };
