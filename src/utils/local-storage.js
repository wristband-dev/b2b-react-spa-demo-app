import {
  LS_KEY_ACCESS_TOKEN,
  LS_KEY_EXPIRES_AT,
  LS_KEY_IDENTITY_PROVIDER_NAME,
  LS_KEY_LOGIN_STATE_DATA,
  LS_KEY_REFRESH_TOKEN,
  LS_KEY_TENANT_DOMAIN_NAME,
  LS_KEY_TENANT_ID,
  LS_KEY_USER_ID,
} from './constants';
import { calculateExpTimeWithBuffer } from './util';

// //////////////////////////////////////////
//  LOGIN STATE
// //////////////////////////////////////////

function clearLoginState() {
  localStorage.removeItem(LS_KEY_LOGIN_STATE_DATA);
}

export function saveLoginState(loginStateData) {
  localStorage.setItem(LS_KEY_LOGIN_STATE_DATA, JSON.stringify(loginStateData));
}

export function getAndClearLoginState() {
  const value = localStorage.getItem(LS_KEY_LOGIN_STATE_DATA);
  if (!value) {
    return null;
  }

  clearLoginState();
  return JSON.parse(value);
}

// //////////////////////////////////////////
//  SESSION STATE
// //////////////////////////////////////////

export function getTenantDomainName() {
  return localStorage.getItem(LS_KEY_TENANT_DOMAIN_NAME);
}

export function getTokenData() {
  return {
    accessToken: localStorage.getItem(LS_KEY_ACCESS_TOKEN),
    refreshToken: localStorage.getItem(LS_KEY_REFRESH_TOKEN),
    expiresAt: localStorage.getItem(LS_KEY_EXPIRES_AT),
  };
}

export function getLogoutData() {
  return {
    refreshToken: localStorage.getItem(LS_KEY_REFRESH_TOKEN),
    tenantDomainName: localStorage.getItem(LS_KEY_TENANT_DOMAIN_NAME),
  };
}

export function saveTokenData(tokenData) {
  localStorage.setItem(LS_KEY_ACCESS_TOKEN, tokenData.access_token);
  localStorage.setItem(LS_KEY_EXPIRES_AT, calculateExpTimeWithBuffer(tokenData.expires_in));
  localStorage.setItem(LS_KEY_REFRESH_TOKEN, tokenData.refresh_token);
}

export function saveSessionData(tokenData, userinfo, tenantDomainName) {
  saveTokenData(tokenData);
  localStorage.setItem(LS_KEY_USER_ID, userinfo.sub);
  localStorage.setItem(LS_KEY_TENANT_ID, userinfo.tnt_id);
  localStorage.setItem(LS_KEY_IDENTITY_PROVIDER_NAME, userinfo.idp_name);
  localStorage.setItem(LS_KEY_TENANT_DOMAIN_NAME, tenantDomainName);
}

export function clearSessionData() {
  localStorage.removeItem(LS_KEY_ACCESS_TOKEN);
  localStorage.removeItem(LS_KEY_EXPIRES_AT);
  localStorage.removeItem(LS_KEY_REFRESH_TOKEN);
  localStorage.removeItem(LS_KEY_USER_ID);
  localStorage.removeItem(LS_KEY_TENANT_ID);
  localStorage.removeItem(LS_KEY_IDENTITY_PROVIDER_NAME);
  localStorage.removeItem(LS_KEY_TENANT_DOMAIN_NAME);
  clearLoginState();
}
