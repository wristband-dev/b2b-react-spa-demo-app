import { LS_KEY_ACCESS_TOKEN, OWNER_ROLE_REGEX } from './constants';

export function bearerToken() {
  if (!localStorage.getItem(LS_KEY_ACCESS_TOKEN)) {
    throw new Error('No access token found for auth header.');
  }

  return { headers: { Authorization: `Bearer ${localStorage.getItem(LS_KEY_ACCESS_TOKEN)}` } };
}

export function isOwnerRole(roleName) {
  return OWNER_ROLE_REGEX.test(roleName);
}
