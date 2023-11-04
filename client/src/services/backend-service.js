import { backendClient } from '../client';

import { BASIC_AUTH_AXIOS_CONFIG, CLIENT_ID } from '../utils/constants';
import {backendClientWithInterceptor} from "../client/backend-client-with-interceptor";

const AUTH_CODE_GRANT_TYPE = 'authorization_code';
const REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';


export const getTenant = async function(tenantId, requestConfig) {
  const tenantResponse = await backendClientWithInterceptor.get(`/v1/tenants/${tenantId}`, requestConfig);
  const tenant = tenantResponse.data;

  return {
    id: tenantId,
    displayName: tenant.displayName,
    domainName: tenant.domainName,
    address: { ...tenant.publicMetadata.address },
    invoiceEmail: tenant.publicMetadata.invoiceEmail
  };
};


export const getAssignableRoleOptions = async function (tenantId, requestConfig) {
  const queryString = 'include_application_roles=true&fields=id,displayName&sort_by=displayName:asc';
  const response = await backendClientWithInterceptor.get(`/v1/tenants/${tenantId}/roles?${queryString}`, requestConfig);
  // console.log(`response : ${JSON.stringify(response.data)}`)
  return response.data.items.map((role) => {
    return { value: role.id, label: role.displayName };
  });
};

export const getAssignedRole = async function (userId, requestConfig) {
  const response = await backendClientWithInterceptor.get(`/v1/users/${userId}/roles?fields=id,name,displayName&count=1`, requestConfig);
  const { totalResults, items } = response.data;
  return totalResults > 0 ? items[0] : null;
};


export const getUser = async function(userId, requestConfig) {
  const response = await backendClientWithInterceptor.get(`/v1/users/${userId}`, requestConfig);
  return response.data;
};

export const getIdentityProviderByNameForTenant = async function (tenantId, identityProviderName, requestConfig) {
  const nameQuery = `names=${identityProviderName}`;
  const path = `/v1/tenants/${tenantId}/identity-providers/resolve-overrides?${nameQuery}`;
  const response = await backendClientWithInterceptor.post(path, null, requestConfig);
  return response.data.items[0].item;
};


export const getPasswordPolicyForTenant = async function (tenantId, requestConfig) {
  const path = `/v1/tenants/${tenantId}/password-policies/resolve-overrides`;
  const response = await backendClientWithInterceptor.post(path, null, requestConfig);
  return response.data;
};

export const getUserSchemaForTenant = async function (tenantId, requestConfig) {
  const response = await backendClientWithInterceptor.post(`/v1/tenants/${tenantId}/user-schemas/resolve-overrides`, null, requestConfig);
  return response.data;
};

export const revokeRefreshToken = async function (token) {
  await backendClient.post(`/v1/oauth2/revoke`, createFormData({ token: token, client_id: CLIENT_ID }), BASIC_AUTH_AXIOS_CONFIG);
};

export const exchangeAuthCodeForTokens = async function(code, redirectUri, codeVerifier) {
  const authData = createFormData({
    grant_type: AUTH_CODE_GRANT_TYPE,
    code: code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
    client_id: CLIENT_ID
  });

  //console.log(`authData: ${authData}`);
  const response = await backendClient.post('/v1/oauth2/token', authData, BASIC_AUTH_AXIOS_CONFIG);
  return response.data;
};

export const getOauth2Userinfo = async function(accessToken) {
  const requestConfig = { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'} };
  const response = await backendClient.get('/v1/oauth2/userinfo', requestConfig);
  return response.data;
};

export const createFormData = formParams => {
  if (!formParams) {
    return '';
  }

  return Object.keys(formParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(formParams[key])}`)
      .join('&');
};

/* WRISTBAND_TOUCHPOINT - RESOURCE API */
// The Wristband Service contains all code for REST API calls to the Wristband platform.

export const cancelEmailChange = async function (changeEmailRequestId, requestConfig) {
  await backendClientWithInterceptor.post('/v1/change-email/cancel-email-change', { changeEmailRequestId }, requestConfig);
};

export const cancelNewUserInvite = async function (newUserInvitationRequestId, requestConfig) {
  await backendClientWithInterceptor.post(`/v1/new-user-invitation/cancel-invite`, { newUserInvitationRequestId }, requestConfig);
};

export const changePassword = async function (userId, currentPassword, newPassword, requestConfig) {
  await backendClientWithInterceptor.post(`/v1/change-password`, { userId, currentPassword, newPassword }, requestConfig);
};


export const getChangeEmailRequestsForUser = async function (userId, requestConfig) {
  const statusQuery = encodeURIComponent(`status ne "CANCELED" and status ne "COMPLETED"`);
  const response = await backendClientWithInterceptor.get(`/v1/users/${userId}/change-email-requests?query=${statusQuery}`, requestConfig);
  return response.data;
};



export const getNewUserInviteRequestsForTenant = async function (tenantId, requestConfig) {
  const statusFilter = `?query=${encodeURIComponent(`status eq "PENDING_INVITE_ACCEPTANCE"`)}`;
  const path = `/v1/tenants/${tenantId}/new-user-invitation-requests${statusFilter}`;
  const response = await backendClientWithInterceptor.get(path, requestConfig);
  return response.data;
};


export const getPermissionInfo = async function (values, requestConfig) {
  const response = await backendClientWithInterceptor.get(`/v1/permission-info?values=${values.join(',')}`, requestConfig);
  const { totalResults, items } = response.data;
  return totalResults > 0
      ? items.map((item) => {
        return item.value;
      })
      : [];
};



export const getUserCountForTenant = async function (tenantId, requestConfig) {
  const response = await backendClientWithInterceptor.get(`/v1/tenants/${tenantId}/users?count=0`, requestConfig);
  return response.data.totalResults;
};


export const inviteNewUser = async function (tenantId, email, roleId, requestConfig) {
  const inviteData = { tenantId, email, rolesToAssign: [roleId], language: 'en-US' };
  await backendClientWithInterceptor.post(`/v1/new-user-invitation/invite-user`, inviteData, requestConfig);
};

export const refreshAccessToken = async function (refreshToken) {
  const authData = { grant_type: REFRESH_TOKEN_GRANT_TYPE, refresh_token: refreshToken , client_id: CLIENT_ID};
  const response = await backendClient.post('/v1/oauth2/token', createFormData(authData), BASIC_AUTH_AXIOS_CONFIG);
  return response.data;
};

export const requestEmailChange = async function (userId, newEmail, requestConfig) {
  console.log(`requestEmailChange : ${userId}, ${newEmail} `)
  await backendClientWithInterceptor.post('/v1/change-email/request-email-change', { userId, newEmail }, requestConfig);
};


export const updateTenant = async function (tenantId, tenantData, requestConfig) {
  const { address, invoiceEmail, displayName } = tenantData;
  const properTenantData = { displayName, publicMetadata: { address, invoiceEmail } };

  const tenantResponse = await backendClientWithInterceptor.patch(`/v1/tenants/${tenantId}`, properTenantData, requestConfig);
  const tenant = tenantResponse.data;
  return {
    id: tenantId,
    displayName: tenant.displayName,
    domainName: tenant.domainName,
    address: { ...tenant.publicMetadata.address },
    invoiceEmail: tenant.publicMetadata.invoiceEmail,
  };
};

export const updateUser = async function (userId, userData, requestConfig) {
  const response = await backendClientWithInterceptor.patch(`/v1/users/${userId}`, userData, requestConfig);
  return response.data;
};



