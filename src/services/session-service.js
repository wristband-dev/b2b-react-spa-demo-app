import {
  LS_KEY_ACCESS_TOKEN,
  LS_KEY_IDENTITY_PROVIDER_NAME,
  LS_KEY_REFRESH_TOKEN,
  LS_KEY_TENANT_ID,
  LS_KEY_USER_ID,
} from '../utils/constants';
import { backendService } from '.';
import { auth, util } from '../utils';

const WRISTBAND_IDP_NAME = 'wristband';

export const fetchSessionCompany = async function () {
  const company = await backendService.getTenant(localStorage.getItem(LS_KEY_TENANT_ID), util.bearerToken());
  return company;
};

export const fetchSessionRole = async function () {
  const assignedRole = await backendService.getAssignedRole(localStorage.getItem(LS_KEY_USER_ID), util.bearerToken());
  return assignedRole;
};

export const fetchSessionUser = async function () {
  const user = await backendService.getUser(localStorage.getItem(LS_KEY_USER_ID), util.bearerToken());
  return user;
};

export const getAuthState = function () {
  const accessToken = localStorage.getItem(LS_KEY_ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(LS_KEY_REFRESH_TOKEN);
  return !!accessToken && !!refreshToken;
};

export const getInitialSessionData = async function () {
  const identityProviderName = localStorage.getItem(LS_KEY_IDENTITY_PROVIDER_NAME);
  const tenantId = localStorage.getItem(LS_KEY_TENANT_ID);
  const userId = localStorage.getItem(LS_KEY_USER_ID);

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const [user, assignedRole, idp, pwPolicy, userSchema, company] = await Promise.all([
      backendService.getUser(userId, util.bearerToken()),
      backendService.getAssignedRole(userId, util.bearerToken()),
      backendService.getIdentityProviderByNameForTenant(tenantId, identityProviderName, util.bearerToken()),
      backendService.getPasswordPolicyForTenant(tenantId, util.bearerToken()),
      backendService.getUserSchemaForTenant(tenantId, util.bearerToken()),
      backendService.getTenant(tenantId, util.bearerToken()),
    ]);

    if (user.status !== 'ACTIVE' || !assignedRole) {
      throw new Error('Access Denied');
    }

    const passwordMinLength = pwPolicy.items.map((override) => {
      return override.item;
    })[0].minimumLength;
    const requiredFields = userSchema.items[0].item.baseProfile.required;
    const isWristbandIdp = identityProviderName === WRISTBAND_IDP_NAME;

    return {
      user,
      assignedRole,
      company,
      configs: {
        usernameRequired: isWristbandIdp && idp.loginIdentifiers.includes('USERNAME'),
        passwordRequired: isWristbandIdp && idp.loginFactors.includes('PASSWORD'),
        passwordMinLength,
        requiredFields,
      },
    };
  } catch (error) {
    console.log(error);
    await auth.logout();
    return null;
  }
};

export const fetchSessionConfigs = async function () {
  const identityProviderName = localStorage.getItem(LS_KEY_IDENTITY_PROVIDER_NAME);
  const tenantId = localStorage.getItem(LS_KEY_TENANT_ID);

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const [wristbandIdp, pwPolicy, userSchema] = await Promise.all([
      backendService.getIdentityProviderByNameForTenant(tenantId, identityProviderName, util.bearerToken()),
      backendService.getPasswordPolicyForTenant(tenantId, util.bearerToken()),
      backendService.getUserSchemaForTenant(tenantId, util.bearerToken()),
    ]);

    const passwordMinLength = pwPolicy.items.map((override) => {
      return override.item;
    })[0].minimumLength;
    const requiredFields = userSchema.items[0].item.baseProfile.required;
    const isWristbandIdp = identityProviderName === WRISTBAND_IDP_NAME;

    return {
      usernameRequired: isWristbandIdp && wristbandIdp.loginIdentifiers.includes('USERNAME'),
      passwordRequired: isWristbandIdp && wristbandIdp.loginFactors.includes('PASSWORD'),
      passwordMinLength,
      requiredFields,
    };
  } catch (error) {
    console.log(error);
    await auth.logout();
    return null;
  }
};

export const updateSessionCompany = async function (company) {
  const { id, ...updatedCompany } = company;
  return await backendService.updateTenant(id, updatedCompany, util.bearerToken());
};

export const updateSessionUser = async function (user) {
  const { id, ...updatedUser } = user;
  const filteredObj = (obj) =>
    Object.entries(obj)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => !!value || typeof value === 'boolean')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  const filteredUserUpdate = filteredObj(updatedUser);
  return await backendService.updateUser(id, filteredUserUpdate, util.bearerToken());
};
