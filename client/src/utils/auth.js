import {
  APPLICATION_DOMAIN,
  CLIENT_ID,
  IS_LOCALHOST,
  INVOTASTIC_HOST,
  AUTH_CALLBACK_URL,
  APPLICATION_LOGIN_URL,
  LS_KEY_ACCESS_TOKEN,
  LS_KEY_EXPIRES_AT,
  LS_KEY_REFRESH_TOKEN,
  LS_KEY_USER_ID,
  LS_KEY_TENANT_ID,
  LS_KEY_IDENTITY_PROVIDER_NAME,
  LS_KEY_TENANT_DOMAIN_NAME,
  LS_KEY_LOGIN_STATE_DATA,
} from './constants';
import { backendService } from '../services';

// ////////////////////////////////////////////////////////////////////////
//   HELPER FUNCTIONS
// ////////////////////////////////////////////////////////////////////////

function parseTenantDomainName(host) {
  return host.substr(0, host.indexOf('.'));
}

function isValidDomainSuffix(host) {
  return host.substr(host.indexOf('.') + 1) === INVOTASTIC_HOST;
}

function base64URLEncode(strToEncode) {
  return strToEncode.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function createCryptoUniqueStr() {
  // Generate a random 64-byte array using the Web Crypto API
  const array = new Uint8Array(64);
  window.crypto.getRandomValues(array);
  // Convert the random bytes to a base64 string
  const encoded = btoa(String.fromCharCode(...array));
  // Return the base64 URL-safe encoded string
  return base64URLEncode(encoded);
}

async function createCodeChallenge(codeVerifier) {
  // Step 1: Encode the code verifier as a Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);

  // Step 2: Hash the code verifier using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Step 3: Convert the hash to a base64 URL-encoded string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64String = btoa(hashArray.map((byte) => String.fromCharCode(byte)).join(''));

  // Step 4: Replace characters for URL compatibility
  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function toQueryString(queryParams = {}) {
  const params = new URLSearchParams(queryParams);
  return params.toString();
}

function calculateExpTimeWithBuffer(numOfSeconds) {
  // 5 minute safety buffer included for expiration checks
  const secToMs = 1000;
  return Date.now() + numOfSeconds * secToMs - 300 * secToMs;
}

function saveTokenData(tokenData, userinfo, tenantDomainName) {
  localStorage.setItem(LS_KEY_ACCESS_TOKEN, tokenData.access_token);
  localStorage.setItem(LS_KEY_EXPIRES_AT, calculateExpTimeWithBuffer(tokenData.expires_in));
  localStorage.setItem(LS_KEY_REFRESH_TOKEN, tokenData.refresh_token);
  localStorage.setItem(LS_KEY_USER_ID, userinfo.sub);
  localStorage.setItem(LS_KEY_TENANT_ID, userinfo.tnt_id);
  localStorage.setItem(LS_KEY_IDENTITY_PROVIDER_NAME, userinfo.idp_name);
  localStorage.setItem(LS_KEY_TENANT_DOMAIN_NAME, tenantDomainName);
}

function clearTokenData() {
  localStorage.removeItem(LS_KEY_ACCESS_TOKEN);
  localStorage.removeItem(LS_KEY_EXPIRES_AT);
  localStorage.removeItem(LS_KEY_REFRESH_TOKEN);
  localStorage.removeItem(LS_KEY_USER_ID);
  localStorage.removeItem(LS_KEY_TENANT_ID);
  localStorage.removeItem(LS_KEY_IDENTITY_PROVIDER_NAME);
  localStorage.removeItem(LS_KEY_TENANT_DOMAIN_NAME);
  localStorage.removeItem(LS_KEY_LOGIN_STATE_DATA);
}

function isAccessTokenExpired(expiresAtMs) {
  if (!expiresAtMs) {
    return true;
  }
  const currentTime = Date.now();
  return currentTime >= expiresAtMs;
}

// async function throwIfNoResult(result) {
//   if (!result) {
//     throw new Error('No result');
//   }
//   return result;
// }

// const refreshExpiredTokenClosure = () => {
//   let isCalled = false;
//   let runningPromise = undefined;
//   return () => {
//     if (isCalled) {
//       return runningPromise;
//     } else {
//       isCalled = true;
//       runningPromise = backendService
//         .refreshAccessToken(localStorage.getItem(LS_KEY_REFRESH_TOKEN))
//         .then(throwIfNoResult);
//       return runningPromise;
//     }
//   };
// };
// const refreshExpiredToken = refreshExpiredTokenClosure();
// Refresh token function - directly handles the async call

// ////////////////////////////////////////////////////////////////////////
//   WRISTBAND SDK CANDIDATES
// ////////////////////////////////////////////////////////////////////////

/**
 * LOGIN ENDPOINT FUNCTION
 */
export async function login() {
  const query = new URL(window.location.href).searchParams;
  const tenantDomainParam = query.get('tenant_domain');
  const returnUrl = query.get('return_url');
  const loginHint = query.get('login_hint');

  //Make sure domain is valid before attempting OAuth2 Auth Code flow for tenant-level login.
  if (!IS_LOCALHOST && !isValidDomainSuffix(APPLICATION_DOMAIN)) {
    console.error(`[${APPLICATION_DOMAIN}] has invalid domain suffix. Redirecting to application-level login.`);
    window.location = APPLICATION_LOGIN_URL;
    return;
  }

  if (IS_LOCALHOST && !tenantDomainParam) {
    console.error(`Tenant domain query param not found. Redirecting to application-level login.`);
    window.location = APPLICATION_LOGIN_URL;
    return;
  }

  const tenantDomainName = IS_LOCALHOST ? tenantDomainParam : parseTenantDomainName(APPLICATION_DOMAIN);
  const state = createCryptoUniqueStr();
  const codeVerifier = createCryptoUniqueStr();

  const loginStateData = { state, tenantDomainName, codeVerifier, returnUrl };
  localStorage.setItem(LS_KEY_LOGIN_STATE_DATA, JSON.stringify(loginStateData));

  const codeChallenge = await createCodeChallenge(codeVerifier);

  const queryParam = toQueryString({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: AUTH_CALLBACK_URL,
    state,
    scope: 'openid offline_access',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    nonce: createCryptoUniqueStr(),
    ...(loginHint && { login_hint: loginHint }),
  });

  window.location.href = `https://${tenantDomainName}-${APPLICATION_DOMAIN}/api/v1/oauth2/authorize?${queryParam}`;
}

/**
 * CALLBACK ENDPOINT FUNCTION
 */
export async function callback() {
  const query = new URL(window.location.href).searchParams;
  const code = query.get('code');
  const state = query.get('state');
  const error = query.get('error');
  const errorDescription = query.get('error_description');

  const loginStateData = JSON.parse(localStorage.getItem(LS_KEY_LOGIN_STATE_DATA));
  // TODO: Fix return_url and add tenant custom domains...
  const { codeVerifier, state: returnState, tenantDomainName } = loginStateData;
  const tenantDomain = IS_LOCALHOST ? '' : `${tenantDomainName}.`;

  //Safety check
  if (state !== returnState) {
    throw new Error(`Returned state [${returnState}] not equal to query state [${state}]`);
  }
  if (error) {
    console.log(`ERROR: ${error}`);
    if (error.toLowerCase() === 'login_required') {
      window.location = `http://${tenantDomain}${INVOTASTIC_HOST}/login`;
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
  // Save the user's application session data into the storage
  saveTokenData(tokenData, userinfo, tenantDomainName);

  // Send the user back to the Invotastic application.
  window.location = `http://${INVOTASTIC_HOST}/home` || `http://${tenantDomain}${INVOTASTIC_HOST}/home`;
}

/**
 * LOGOUT ENDPOINT FUNCTION
 */
export async function logout() {
  // Safety checks
  const tenantDomainName = localStorage.getItem(LS_KEY_TENANT_DOMAIN_NAME);
  if (IS_LOCALHOST) {
    if (!tenantDomainName) {
      console.error(`No session found. Redirecting to application-level login.`);
      window.location = APPLICATION_LOGIN_URL;
      return;
    }
  } else if (!isValidDomainSuffix(APPLICATION_DOMAIN)) {
    console.error(`[${APPLICATION_DOMAIN}] has invalid domain suffix. Redirecting to application-level login.`);
    window.location = APPLICATION_LOGIN_URL;
    return;
  }

  // Revoke the refresh token only if present.
  if (localStorage.getItem(LS_KEY_REFRESH_TOKEN)) {
    try {
      /* WRISTBAND_TOUCHPOINT - RESOURCE API */
      backendService.revokeRefreshToken(localStorage.getItem(LS_KEY_REFRESH_TOKEN));
    } catch (error) {
      console.error(`Revoking token during logout failed due to: ${error}`);
    }
  }

  // Always destroy tokenData if present.
  clearTokenData();

  window.location.href = `https://${tenantDomainName}-${APPLICATION_DOMAIN}/api/v1/logout?client_id=${CLIENT_ID}`;
}

/**
 * REFRESH TOKEN IF EXPIRED FUNCTION
 */
export async function refreshTokenIfExpired() {
  const accessToken = localStorage.getItem(LS_KEY_ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(LS_KEY_REFRESH_TOKEN);
  const expiresAt = localStorage.getItem(LS_KEY_EXPIRES_AT);

  if (!accessToken || !expiresAt || !refreshToken) {
    throw new Error('Unauthorized');
  }

  if (!isAccessTokenExpired(expiresAt)) {
    return { accessToken, expiresAt, refreshToken };
  }

  try {
    const tokenData = await backendService.refreshAccessToken(refreshToken);
    localStorage.setItem(LS_KEY_ACCESS_TOKEN, tokenData.access_token);
    localStorage.setItem(LS_KEY_EXPIRES_AT, calculateExpTimeWithBuffer(tokenData.expires_in));
    localStorage.setItem(LS_KEY_REFRESH_TOKEN, tokenData.refresh_token);
    return tokenData;
  } catch (error) {
    console.error(`Failed to refresh token due to: ${error}`);
    throw new Error('Unauthorized');
  }
}
