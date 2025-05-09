import axios from 'axios';

import { auth } from '../utils';

const backendClientWithInterceptor = axios.create({
  baseURL: `https://${import.meta.env.VITE_APPLICATION_VANITY_DOMAIN}/api`,
});

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
// Any HTTP 401s should trigger the user to go log in again. You can optionally catch HTTP 403s as well.
async function unauthorizedAccessResponseInterceptor(error) {
  if (error.response && [401].includes(error.response.status)) {
    await auth.login();
  }

  return Promise.reject(error);
}

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
async function tokenRefreshRequestInterceptor(config) {
  try {
    const tokenData = await auth.refreshTokenIfExpired();
    config.headers.common = { Authorization: `Bearer ${tokenData.access_token}` };
    return config;
  } catch (error) {
    console.log(error);
    // Handle refresh errors, if any
    await auth.login();
    return Promise.reject(error);
  }
}

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
backendClientWithInterceptor.interceptors.request.use(tokenRefreshRequestInterceptor, (error) => {
  Promise.reject(error.response || error.message);
});

backendClientWithInterceptor.interceptors.response.use(undefined, unauthorizedAccessResponseInterceptor);

export { backendClientWithInterceptor };
