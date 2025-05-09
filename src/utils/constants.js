const env = import.meta.env;

export const APPLICATION_DOMAIN = `${env.VITE_APPLICATION_VANITY_DOMAIN}`;
export const CLIENT_ID = `${env.VITE_CLIENT_ID}`;
export const INVOTASTIC_HOST = 'localhost:6001';
export const APPLICATION_LOGIN_URL = `https://${APPLICATION_DOMAIN}/login`;
export const AUTH_CALLBACK_URL = `http://${INVOTASTIC_HOST}/callback`;
export const BASIC_AUTH_AXIOS_CONFIG = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

export const LS_KEY_ACCESS_TOKEN = 'accessToken';
export const LS_KEY_EXPIRES_AT = 'expiresAt';
export const LS_KEY_REFRESH_TOKEN = 'refreshToken';
export const LS_KEY_USER_ID = 'userId';
export const LS_KEY_TENANT_ID = 'tenantId';
export const LS_KEY_IDENTITY_PROVIDER_NAME = 'identityProviderName';
export const LS_KEY_TENANT_DOMAIN_NAME = 'tenantDomainName';
export const LS_KEY_LOGIN_STATE_DATA = 'loginStateData';

export const OWNER_ROLE_REGEX = /^app:[a-zA-Z0-9]+:owner$/;
