'use strict';

/* WRISTBAND_TOUCHPOINT - RESOURCE API */
// The Wristband Service contains all code for REST API calls to the Wristband platform.

const apiClient = require('../client/api-client');
const { BASIC_AUTH_AXIOS_CONFIG } = require('../utils/constants');
const { createFormData } = require('../utils/util');

const AUTH_CODE_GRANT_TYPE = 'authorization_code';
const REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';

exports.cancelEmailChange = async function (changeEmailRequestId, requestConfig) {
  await apiClient.post('/change-email/cancel-email-change', { changeEmailRequestId }, requestConfig);
};

exports.cancelNewUserInvite = async function (newUserInvitationRequestId, requestConfig) {
  await apiClient.post(`/new-user-invitation/cancel-invite`, { newUserInvitationRequestId }, requestConfig);
};

exports.changePassword = async function (userId, currentPassword, newPassword, requestConfig) {
  await apiClient.post(`/change-password`, { userId, currentPassword, newPassword }, requestConfig);
};

exports.exchangeAuthCodeForTokens = async function (code, redirectUri, codeVerifier) {
  const authData = createFormData({
    grant_type: AUTH_CODE_GRANT_TYPE,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });
  const response = await apiClient.post('/oauth2/token', authData, BASIC_AUTH_AXIOS_CONFIG);
  return response.data;
};

exports.getAssignableRoleOptions = async function (tenantId, requestConfig) {
  const queryString = 'include_application_roles=true&fields=id,displayName&sort_by=displayName:asc';
  const response = await apiClient.get(`/tenants/${tenantId}/roles?${queryString}`, requestConfig);
  return response.data.items.map((role) => {
    return { value: role.id, label: role.displayName };
  });
};

exports.getAssignedRole = async function (userId, requestConfig) {
  const response = await apiClient.get(`/users/${userId}/roles?fields=id,name,displayName&count=1`, requestConfig);
  const { totalResults, items } = response.data;
  return totalResults > 0 ? items[0] : null;
};

exports.getChangeEmailRequestsForUser = async function (userId, requestConfig) {
  const statusQuery = encodeURIComponent(`status ne "CANCELED" and status ne "COMPLETED"`);
  const response = await apiClient.get(`/users/${userId}/change-email-requests?query=${statusQuery}`, requestConfig);
  return response.data;
};

exports.getIdentityProviderByNameForTenant = async function (tenantId, identityProviderName, requestConfig) {
  const nameQuery = `names=${identityProviderName}`;
  const path = `/tenants/${tenantId}/identity-providers/resolve-overrides?${nameQuery}`;
  const response = await apiClient.post(path, null, requestConfig);
  return response.data.items[0].item;
};

exports.getNewUserInviteRequestsForTenant = async function (tenantId, requestConfig) {
  const statusFilter = `?query=${encodeURIComponent(`status eq "PENDING_INVITE_ACCEPTANCE"`)}`;
  const path = `/tenants/${tenantId}/new-user-invitation-requests${statusFilter}`;
  const response = await apiClient.get(path, requestConfig);
  return response.data;
};

exports.getOauth2Userinfo = async function (accessToken) {
  const requestConfig = { headers: { Authorization: `Bearer ${accessToken}` } };
  const response = await apiClient.get('/oauth2/userinfo', requestConfig);
  return response.data;
};

exports.getPasswordPolicyForTenant = async function (tenantId, requestConfig) {
  const path = `/tenants/${tenantId}/password-policies/resolve-overrides`;
  const response = await apiClient.post(path, null, requestConfig);
  return response.data;
};

exports.getPermissionInfo = async function (values, requestConfig) {
  const response = await apiClient.get(`/permission-info?values=${values.join(',')}`, requestConfig);
  const { totalResults, items } = response.data;
  return totalResults > 0
    ? items.map((item) => {
        return item.value;
      })
    : [];
};

exports.getTenant = async function (tenantId, requestConfig) {
  const tenantResponse = await apiClient.get(`/tenants/${tenantId}`, requestConfig);
  const tenant = tenantResponse.data;

  return {
    id: tenantId,
    displayName: tenant.displayName,
    domainName: tenant.domainName,
    address: { ...tenant.publicMetadata.address },
    invoiceEmail: tenant.publicMetadata.invoiceEmail,
  };
};

exports.getUser = async function (userId, requestConfig) {
  const response = await apiClient.get(`/users/${userId}`, requestConfig);
  return response.data;
};

exports.getUserCountForTenant = async function (tenantId, requestConfig) {
  const response = await apiClient.get(`/tenants/${tenantId}/users?count=0`, requestConfig);
  return response.data.totalResults;
};

exports.getUserSchemaForTenant = async function (tenantId, requestConfig) {
  const response = await apiClient.post(`/tenants/${tenantId}/user-schemas/resolve-overrides`, null, requestConfig);
  return response.data;
};

exports.inviteNewUser = async function (tenantId, email, roleId, requestConfig) {
  const inviteData = { tenantId, email, rolesToAssign: [roleId], language: 'en-US' };
  await apiClient.post(`/new-user-invitation/invite-user`, inviteData, requestConfig);
};

exports.refreshAccessToken = async function (refreshToken) {
  const authData = { grant_type: REFRESH_TOKEN_GRANT_TYPE, refresh_token: refreshToken };
  const response = await apiClient.post('/oauth2/token', createFormData(authData), BASIC_AUTH_AXIOS_CONFIG);
  return response.data;
};

exports.requestEmailChange = async function (userId, newEmail, requestConfig) {
  await apiClient.post('/change-email/request-email-change', { userId, newEmail }, requestConfig);
};

exports.revokeRefreshToken = async function (token) {
  await apiClient.post(`/oauth2/revoke`, createFormData({ token }), BASIC_AUTH_AXIOS_CONFIG);
};

exports.updateTenant = async function (tenantId, tenantData, requestConfig) {
  const tenantResponse = await apiClient.patch(`/tenants/${tenantId}`, tenantData, requestConfig);
  const tenant = tenantResponse.data;

  return {
    id: tenantId,
    displayName: tenant.displayName,
    domainName: tenant.domainName,
    address: { ...tenant.publicMetadata.address },
    invoiceEmail: tenant.publicMetadata.invoiceEmail,
  };
};

exports.updateUser = async function (userId, userData, requestConfig) {
  const response = await apiClient.patch(`/users/${userId}`, userData, requestConfig);
  return response.data;
};
