import {
  APPLICATION_DOMAIN,
  CLIENT_ID,
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
  isValidReturnUrl,
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
  if (!tenantDomain) {
    console.error(`Tenant domain name not found. Redirecting to application-level login.`);
    window.location.href = APPLICATION_LOGIN_URL;
    return;
  }

  const state = createCryptoUniqueStr();
  const codeVerifier = createCryptoUniqueStr();
  // Prioritize the query param over function arg, if present.
  const returnUrlToSave = returnUrlParam || returnUrl;

  saveLoginState({
    state,
    tenantDomainName: tenantDomain,
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
  window.location.href = `https://${tenantDomain}-${APPLICATION_DOMAIN}/api/v1/oauth2/authorize?${queryParam}`;
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
  if (!tenantDomainParam) {
    console.error(`Tenant domain query param not found. Redirecting to application-level login.`);
    window.location.href = APPLICATION_LOGIN_URL;
    return;
  }

  // Resolve the tenant domain name
  const tenantDomainName = tenantDomainParam;
  if (!tenantDomainName) {
    throw new Error('Callback request is missing the [tenant_domain] query parameter from Wristband');
  }

  // Construct the tenant login URL in the event we have to redirect to login route
  const tenantLoginUrl = `http://${INVOTASTIC_HOST}/login?tenant_domain=${tenantDomainName}`;

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
  window.location.href = isValidReturnUrl(returnUrl) ? returnUrl : `http://${INVOTASTIC_HOST}/home`;
}

/**
 * LOGOUT ROUTE FUNCTION
 */
export async function logout() {
  const { refreshToken, tenantDomainName } = getLogoutData();

  // Always destroy session data.
  clearSessionData();

  if (!tenantDomainName) {
    console.error(`No session found. Redirecting to application-level login.`);
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
  window.location.href = `https://${tenantDomainName}-${APPLICATION_DOMAIN}/api/v1/logout?client_id=${CLIENT_ID}`;
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
