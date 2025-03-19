import {
  APPLICATION_DOMAIN,
  CLIENT_ID,
  IS_LOCALHOST,
  INVOTASTIC_HOST,
  AUTH_CALLBACK_URL,
  APPLICATION_LOGIN_URL,
} from './constants';
import {
  clearSessionData,
  getAndClearLoginState,
  getLogoutData,
  getTenantDomainName,
  getTokenData,
  saveLoginState,
  saveSessionData,
  saveTokenData,
} from './local-storage';
import {
  createCodeChallenge,
  createCryptoUniqueStr,
  isAccessTokenExpired,
  isValidDomainSuffix,
  isValidReturnUrl,
  parseTenantDomainName,
  toQueryString,
} from './util';
import { backendService } from '../services';

// ////////////////////////////////////////////////////////////////////////
//  WRISTBAND SDK CANDIDATES
//  TODO: Add handling for => tenant custom domains, custom logout
//        redirect URLS.
// ////////////////////////////////////////////////////////////////////////

/**
 * LOGIN ROUTE FUNCTION
 */
export async function login(returnUrl = '') {
  const query = new URL(window.location.href).searchParams;
  const returnUrlParam = query.get('return_url');
  const loginHint = query.get('login_hint');
  const tenantDomain = query.get('tenant_domain') || getTenantDomainName();

  // Make sure domain is valid before attempting OAuth2 Auth Code flow for tenant-level login.
  if (!IS_LOCALHOST && !isValidDomainSuffix()) {
    console.error(`Invalid domain suffix. Redirecting to application-level login.`);
    window.location.href = APPLICATION_LOGIN_URL;
    return;
  }
  if (IS_LOCALHOST && !tenantDomain) {
    console.error(`Tenant domain name not found. Redirecting to application-level login.`);
    window.location.href = APPLICATION_LOGIN_URL;
    return;
  }

  const tenantDomainName = IS_LOCALHOST ? tenantDomain : parseTenantDomainName(APPLICATION_DOMAIN);
  const state = createCryptoUniqueStr();
  const codeVerifier = createCryptoUniqueStr();
  // Prioritize the query param over function arg, if present.
  const returnUrlToSave = returnUrlParam || returnUrl;

  saveLoginState({
    state,
    tenantDomainName,
    codeVerifier,
    returnUrl: isValidReturnUrl(returnUrlToSave) ? returnUrlToSave : undefined,
  });

  const codeChallenge = await createCodeChallenge(codeVerifier);
  const queryParam = toQueryString({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: AUTH_CALLBACK_URL,
    state,
    scope: 'openid offline_access email',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    nonce: createCryptoUniqueStr(),
    ...(loginHint && { login_hint: loginHint }),
  });

  // Redirect to the Wristband Authorize Endpoint to start the Login Flow
  window.location.href = `https://${tenantDomainName}-${APPLICATION_DOMAIN}/api/v1/oauth2/authorize?${queryParam}`;
}

/**
 * CALLBACK ROUTE FUNCTION
 */
export async function callback() {
  const query = new URL(window.location.href).searchParams;
  const code = query.get('code');
  const state = query.get('state');
  const error = query.get('error');
  const errorDescription = query.get('error_description');
  const tenantDomainParam = query.get('tenant_domain');

  // Make sure domain is valid before attempting OAuth2 Auth Code flow for tenant-level login.
  if (!IS_LOCALHOST && !isValidDomainSuffix()) {
    console.error(`Invalid domain suffix. Redirecting to application-level login.`);
    window.location.href = APPLICATION_LOGIN_URL;
    return;
  }
  if (IS_LOCALHOST && !tenantDomainParam) {
    console.error(`Tenant domain query param not found. Redirecting to application-level login.`);
    window.location.href = APPLICATION_LOGIN_URL;
    return;
  }

  // Resolve the tenant domain name
  const tenantDomainName = IS_LOCALHOST ? tenantDomainParam : parseTenantDomainName(APPLICATION_DOMAIN);
  if (!tenantDomainName) {
    const errorMessage = IS_LOCALHOST
      ? 'Callback request is missing the [tenant_domain] query parameter from Wristband'
      : 'Callback request URL is missing a tenant subdomain';
    throw new Error(errorMessage);
  }

  // Construct the tenant login URL in the event we have to redirect to login route
  const tenantLoginUrl = IS_LOCALHOST
    ? `http://${INVOTASTIC_HOST}/login?tenant_domain=${tenantDomainName}`
    : `http://${tenantDomainName}.${INVOTASTIC_HOST}/login`;

  // Extract the login state
  const loginStateData = getAndClearLoginState();
  if (!loginStateData) {
    console.error(`Login state not found. Redirecting to login.`);
    window.location.href = tenantLoginUrl;
    return;
  }
  const { codeVerifier, state: returnState, returnUrl } = loginStateData;

  // Validate state and ensure that no errors are present
  if (state !== returnState) {
    console.error(`Returned state [${returnState}] not equal to query state [${state}]`);
    window.location.href = tenantLoginUrl;
    return;
  }
  if (error) {
    console.error(`ERROR: ${error}`);
    if (error.toLowerCase() === 'login_required') {
      window.location.href = tenantLoginUrl;
      return;
    }
    throw new Error(`${error}: ${errorDescription}`);
  }

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  // Now exchange the auth code for a new access token.
  const tokenData = await backendService.exchangeAuthCodeForTokens(code, AUTH_CALLBACK_URL, codeVerifier);
  const { access_token: accessToken } = tokenData;

  /* WRISTBAND_TOUCHPOINT - RESOURCE API */
  // Get a minimal set of the user's data to store in their session data.
  const userinfo = await backendService.getOauth2Userinfo(accessToken);
  // Save the user's application session data into local storage
  saveSessionData(tokenData, userinfo, tenantDomainName);

  // Send the user back to the Invotastic application.
  const tenantDomain = IS_LOCALHOST ? '' : `${tenantDomainName}.`;
  window.location.href = isValidReturnUrl(returnUrl) ? returnUrl : `http://${tenantDomain}${INVOTASTIC_HOST}/home`;
}

/**
 * LOGOUT ROUTE FUNCTION
 */
export async function logout() {
  const { refreshToken, tenantDomainName } = getLogoutData();

  // Always destroy session data.
  clearSessionData();

  if (IS_LOCALHOST) {
    if (!tenantDomainName) {
      console.error(`No session found. Redirecting to application-level login.`);
      window.location = APPLICATION_LOGIN_URL;
      return;
    }
  } else if (!isValidDomainSuffix()) {
    console.error(`Invalid domain suffix. Redirecting to application-level login.`);
    window.location = APPLICATION_LOGIN_URL;
    return;
  }

  // Revoke the refresh token only if present.
  if (refreshToken) {
    try {
      /* WRISTBAND_TOUCHPOINT - RESOURCE API */
      backendService.revokeRefreshToken(refreshToken);
    } catch (error) {
      console.error(`Revoking token during logout failed due to: ${error}`);
    }
  }

  // Redirect to the Wristband Logout Endpoint
  const tenantDomain = IS_LOCALHOST ? tenantDomainName : parseTenantDomainName(APPLICATION_DOMAIN);
  window.location.href = `https://${tenantDomain}-${APPLICATION_DOMAIN}/api/v1/logout?client_id=${CLIENT_ID}`;
}

/**
 * REFRESH TOKEN IF EXPIRED
 */
export async function refreshTokenIfExpired() {
  const { accessToken, refreshToken, expiresAt } = getTokenData();

  if (!accessToken || !expiresAt || !refreshToken) {
    throw new Error('Unauthorized');
  }

  if (!isAccessTokenExpired(expiresAt)) {
    return { accessToken, expiresAt, refreshToken };
  }

  try {
    const tokenData = await backendService.refreshAccessToken(refreshToken);
    saveTokenData(tokenData);
    return tokenData;
  } catch (error) {
    console.error(`Failed to refresh token due to: ${error}`);
    throw new Error('Unauthorized');
  }
}
