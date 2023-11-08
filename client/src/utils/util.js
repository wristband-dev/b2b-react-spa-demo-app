import { APPLICATION_DOMAIN, CLIENT_ID, IS_LOCALHOST, INVOTASTIC_HOST, AUTH_CALLBACK_URL, APPLICATION_LOGIN_URL} from "./constants";
import { LS_KEY_ACCESS_TOKEN, LS_KEY_EXPIRES_AT, LS_KEY_REFRESH_TOKEN, LS_KEY_USER_ID, LS_KEY_TENANT_ID,
  LS_KEY_IDENTITY_PROVIDER_NAME, LS_KEY_TENANT_DOMAIN_NAME, LS_KEY_LOGIN_STATE_DATA} from "./constants";

import cryptoRandomString from 'crypto-random-string';
import CryptoJS from "crypto-js";

import { backendService } from '../services';
import { revokeRefreshToken } from "../services/backend-service";

/* ============================================================ */
/* Functions that deal with Wristband-specific logic.
/* ============================================================ */


export async function redirectToLogout() {
  // Safety checks
  const tenantDomainName = localStorage.getItem(LS_KEY_TENANT_DOMAIN_NAME);
  if (IS_LOCALHOST) {
    if (!tenantDomainName){
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
      /* APITOPIA_TOUCHPOINT - RESOURCE API */
      revokeRefreshToken(localStorage.getItem(LS_KEY_REFRESH_TOKEN));
    } catch (error) {
      console.error(`Revoking token during logout failed due to: ${error}`);
    }
  }

  // Always destroy tokenData if present.
  clearTokenData();

  window.location.href = `http://${tenantDomainName}-${APPLICATION_DOMAIN}/api/v1/logout?client_id=${CLIENT_ID}`;
}


export const parseTenantDomainName = host => {
  return host.substr(0, host.indexOf('.'));
}

export function redirectToLogin() {
  const query = (new URL(window.location.href)).searchParams;
  const tenantDomainParam = query.get("tenant_domain");
  const returnUrl = query.get("return_url");
  const loginHint = query.get("login_hint");

  //Make sure domain is valid before attempting OAuth2 Auth Code flow for tenant-level login.
  if (!IS_LOCALHOST && !isValidDomainSuffix(APPLICATION_DOMAIN)) {
    console.error(`[${APPLICATION_DOMAIN}] has invalid domain suffix. Redirecting to application-level login.`);
    window.location = APPLICATION_LOGIN_URL;
    return;
  }

  if (IS_LOCALHOST && !tenantDomainParam) {
    console.error(`Tenant domain query param not found. Redirecting to application-level login.`);
    window.location = APPLICATION_LOGIN_URL;
    return ;
  }

  const tenantDomainName = IS_LOCALHOST ? tenantDomainParam : parseTenantDomainName(APPLICATION_DOMAIN);
  const state = createCryptoUniqueStr();
  const codeVerifier = createCryptoUniqueStr();

  const loginStateData = { state, tenantDomainName, codeVerifier, returnUrl };
  localStorage.setItem(LS_KEY_LOGIN_STATE_DATA, JSON.stringify(loginStateData));

  const queryParam = toQueryString({
    client_id: `${CLIENT_ID}`,
    response_type: 'code',
    redirect_uri: `${AUTH_CALLBACK_URL}`,
    state: `${state}`,
    scope: `openid offline_access`,
    code_challenge: createCodeChallenge(`${codeVerifier}`),
    code_challenge_method: 'S256',
    nonce: createCryptoUniqueStr(),
    ...(loginHint && { login_hint: loginHint }),
  });

  window.location.href = `http://${tenantDomainName}-${APPLICATION_DOMAIN}/api/v1/oauth2/authorize?${queryParam}`;
}

export async function authCallback() {
  const query = (new URL(window.location.href)).searchParams;
  const code = query.get('code');
  const state = query.get('state');
  const error = query.get('error');
  const errorDescription = query.get('error_description');

  const loginStateData = JSON.parse(localStorage.getItem(LS_KEY_LOGIN_STATE_DATA));
  const {codeVerifier, returnUrl, state: returnState, tenantDomainName} = loginStateData;
  const tenantDomain = IS_LOCALHOST ? '' : `${tenantDomainName}.`;

  //Safety check
  if (state !== returnState) {
    throw new Error(`Returned state [${returnState}] not equal to query state [${state}]`);
  }
  if (error) {
    console.log(`ERROR: ${error}`);
    if (error.toLowerCase() === 'login_required') {
      window.location = (`http://${tenantDomain}${INVOTASTIC_HOST}/login`);
    }
    throw new Error(`${error}: ${errorDescription}`);
  }
  /* APITOPIA_TOUCHPOINT - AUTHENTICATION */
  // Now exchange the auth code for a new access token.

  const tokenData = await backendService.exchangeAuthCodeForTokens(code, AUTH_CALLBACK_URL, codeVerifier);
  const {access_token: accessToken} = tokenData;

  /* APITOPIA_TOUCHPOINT - RESOURCE API */
  // Get a minimal set of the user's data to store in their session data.
  const userinfo = await backendService.getOauth2Userinfo(accessToken);
  // Save the user's application session data into the storage
  saveTokenData(tokenData, userinfo, tenantDomainName);

  // Send the user back to the Invotastic application.
  window.location = (`http://${INVOTASTIC_HOST}/home` || `http://${tenantDomain}${INVOTASTIC_HOST}/home`);
}

export function calculateExpTimeWithBuffer(numOfSeconds) {
  // 5 minute safety buffer included for expiration checks
  const secToMs = 1000;
  return Date.now() + numOfSeconds*secToMs - 300 * secToMs;
}

export function saveTokenData(tokenData, userinfo, tenantDomainName) {
  // Set token data
  localStorage.setItem(LS_KEY_ACCESS_TOKEN, tokenData.access_token);
  localStorage.setItem(LS_KEY_EXPIRES_AT, calculateExpTimeWithBuffer(tokenData.expires_in))
  localStorage.setItem(LS_KEY_REFRESH_TOKEN, tokenData.refresh_token);
  localStorage.setItem(LS_KEY_USER_ID, userinfo.sub);
  localStorage.setItem(LS_KEY_TENANT_ID, userinfo.tnt_id);
  localStorage.setItem(LS_KEY_IDENTITY_PROVIDER_NAME, userinfo.idp_name);
  localStorage.setItem(LS_KEY_TENANT_DOMAIN_NAME, tenantDomainName);
};

export function clearTokenData() {
  // Set token data
  localStorage.removeItem(LS_KEY_ACCESS_TOKEN);
  localStorage.removeItem(LS_KEY_EXPIRES_AT);
  localStorage.removeItem(LS_KEY_REFRESH_TOKEN);
  localStorage.removeItem(LS_KEY_USER_ID);
  localStorage.removeItem(LS_KEY_TENANT_ID);
  localStorage.removeItem(LS_KEY_IDENTITY_PROVIDER_NAME);
  localStorage.removeItem(LS_KEY_TENANT_DOMAIN_NAME);
  localStorage.removeItem(LS_KEY_LOGIN_STATE_DATA);
};

export function addressToTextBlock(address = {}) {
  const { street1, street2, city, state, zipCode } = address;
  const streetInfo = street2 ? `${street1}\n${street2}` : street1;
  return `${streetInfo}\n${city}, ${state} ${zipCode}`;
}

export function createCryptoUniqueStr() {
  return base64URLEncode(cryptoRandomString({length: 64}));
};

export function base64URLEncode(strToEncode) {
  return strToEncode
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
}

export function toCapitalizedCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function createCodeChallenge(codeVerifier) {
  const codeChallenge = CryptoJS.SHA256(codeVerifier)
      .toString(CryptoJS.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  return codeChallenge;
}

export function toQueryString(queryParams = {}) {
  const params = new URLSearchParams(queryParams);
  return params.toString();
};

export function isEmptyPhoneNumber(phoneNumber) {
  return !phoneNumber || phoneNumber === '+';
}

export function isValidDomainSuffix(host) {
  return host.substr(host.indexOf('.') + 1) === INVOTASTIC_HOST;
}

export function bearerToken() {
  if (!localStorage.getItem(LS_KEY_ACCESS_TOKEN)) {
    throw new Error('No access token found in session for auth header.');
  }

  return { headers: { Authorization: `Bearer ${localStorage.getItem(LS_KEY_ACCESS_TOKEN)}` } };
};

export function bearerToAccessToken(authHeader) {
  const parts= authHeader.split(' ');
  let accessToken = null;
  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      accessToken = credentials;
    }
    return accessToken;
  }
};

export function isAccessTokenExpired(expiresAtMs) {
  if (!expiresAtMs) {
    return true;
  }
  const currentTime = Date.now();
  return currentTime >= expiresAtMs;
};

export async function throwIfNoResult (result) {
  if (!result) throw new Error("No result");
  return result;
};

export async function wait (ms) {
  new Promise((r) => setTimeout(r, ms));
}

export async function retryOperation (operation, delay, retries) {
  operation().catch(reason => retries > 0 ? wait(delay).then(async () => await retryOperation(operation, delay, retries-1)) : Promise.reject(reason));
}
