import {
  LS_KEY_ACCESS_TOKEN,
  LS_KEY_EXPIRES_AT,
  LS_KEY_IDENTITY_PROVIDER_NAME,
  LS_KEY_REFRESH_TOKEN,
  LS_KEY_TENANT_ID,
  LS_KEY_USER_ID
} from '../utils/constants';
import { backendService } from '../services';
import { util } from '../utils';
import { backendClient } from "../client";

export const cancelChangeEmailRequest = async function (request) {
  const company = await backendService.cancelEmailChange(request.requestId, util.bearerToken());
  return company;
};

export const cancelNewUserInvite = async function (requestId) {
  await backendService.cancelNewUserInvite(requestId, util.bearerToken());
};

export const changePassword = async function (request) {
  await backendService.changePassword(localStorage.getItem(LS_KEY_USER_ID), request.currentPassword, request.newPassword, util.bearerToken());
};

export const createChangeEmailRequest = async function (request) {
  await backendService.requestEmailChange(localStorage.getItem(LS_KEY_USER_ID), request.newEmail, util.bearerToken());
};

export const createNewUserInvite = async function (request) {
  await backendService.inviteNewUser(localStorage.getItem(LS_KEY_TENANT_ID), request.email, request.roleId, util.bearerToken());
};

export const fetchAssignableRoleOptions = async function () {
  const response = await backendService.getAssignableRoleOptions(localStorage.getItem(LS_KEY_TENANT_ID), util.bearerToken());
  //console.log(`fetchAssignedableRoleOptions : ${JSON.stringify(response)}`);
  return response;
};

export const fetchChangeEmailRequests = async function (request) {
  const response = await backendService.getChangeEmailRequestsForUser(localStorage.getItem(LS_KEY_USER_ID), util.bearerToken());
  return response;
};

export const fetchNewUserInvites = async function () {
  const response = await backendService.getNewUserInviteRequestsForTenant(localStorage.getItem(LS_KEY_TENANT_ID), util.bearerToken());
  return response;
};

export const fetchUserCount = async function () {
  const count =  await backendService.getUserCountForTenant(localStorage.getItem(LS_KEY_TENANT_ID), util.bearerToken());
  return count;
};
