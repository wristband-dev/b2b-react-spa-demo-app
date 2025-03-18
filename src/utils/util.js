import { sha256 } from 'js-sha256';

import { INVOTASTIC_HOST, LS_KEY_ACCESS_TOKEN, OWNER_ROLE_REGEX } from './constants';

export function bearerToken() {
  if (!localStorage.getItem(LS_KEY_ACCESS_TOKEN)) {
    throw new Error('No access token found for auth header.');
  }

  return { headers: { Authorization: `Bearer ${localStorage.getItem(LS_KEY_ACCESS_TOKEN)}` } };
}

export function isOwnerRole(roleName) {
  return OWNER_ROLE_REGEX.test(roleName);
}

export function parseTenantDomainName() {
  const { host } = window.location;
  return host.substring(0, host.indexOf('.'));
}

export function isValidDomainSuffix() {
  const { host } = window.location;
  return host.substring(host.indexOf('.') + 1) === INVOTASTIC_HOST;
}

/**
 * Encode a string as Base64 URL-safe
 * @param {string} value - Value to encode
 * @returns {string} Base64 URL-safe encoded string
 */
export function base64URLEncode(value) {
  // First convert to regular base64
  let base64;
  if (typeof str === 'string') {
    base64 = btoa(value);
  } else {
    base64 = btoa(String.fromCharCode(...new Uint8Array(value)));
  }

  // Then make it URL safe
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Generate a cryptographically secure random string
 * @returns {string} Random string suitable for PKCE
 */
export function createCryptoUniqueStr() {
  // Generate a random 64-byte array using the Web Crypto API
  const array = new Uint8Array(64);
  window.crypto.getRandomValues(array);
  // Return the base64 URL-safe encoded string
  return base64URLEncode(array);
}

/**
 * Create a code challenge from a code verifier using SHA-256
 * Works in both secure and non-secure contexts
 *
 * @param {string} codeVerifier - The code verifier string
 * @returns {Promise<string>} The code challenge
 */
export async function createCodeChallenge(codeVerifier) {
  try {
    // Try using the Web Crypto API (secure contexts only)
    if (window.crypto && window.crypto.subtle) {
      // Step 1: Encode the code verifier as a Uint8Array
      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);

      // Step 2: Hash the code verifier using SHA-256
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);

      // Step 3: Convert the hash to a base64 URL-encoded string
      return base64URLEncode(hashBuffer);
    } else {
      throw new Error('Web Crypto API not available');
    }
  } catch (error) {
    console.warn('Using fallback SHA-256 implementation for PKCE code challenge');

    // Fallback to js-sha256 library
    const hash = sha256(codeVerifier);

    // Convert hex string to byte array
    const hashArray = [];
    for (let i = 0; i < hash.length; i += 2) {
      hashArray.push(parseInt(hash.substring(i, i + 2), 16));
    }

    // Convert to base64 and make URL safe
    return base64URLEncode(new Uint8Array(hashArray));
  }
}

export function toQueryString(queryParams = {}) {
  const params = new URLSearchParams(queryParams);
  return params.toString();
}

export function calculateExpTimeWithBuffer(numOfSeconds) {
  // 5 minute safety buffer included for expiration checks
  const secToMs = 1000;
  return Date.now() + numOfSeconds * secToMs - 300 * secToMs;
}

export function isAccessTokenExpired(expiresAtMs) {
  if (!expiresAtMs) {
    return true;
  }
  const currentTime = Date.now();
  return currentTime >= expiresAtMs;
}
