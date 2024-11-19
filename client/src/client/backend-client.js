import axios from 'axios';

import { auth } from '../utils';

const backendClient = axios.create({
  baseURL: `https://${import.meta.env.VITE_APPLICATION_DOMAIN}/api`,
});

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
// Any HTTP 401s should trigger the user to go log in again.  This happens when their
// session cookie has expired and/or the CSRF cookie/header are missing in the request.
// You can optionally catch HTTP 403s as well.
const unauthorizedAccessInterceptor = async (error) => {
  if (error.response && [401].includes(error.response.status)) {
    await auth.login();
  }

  return Promise.reject(error);
};

backendClient.interceptors.response.use(undefined, unauthorizedAccessInterceptor);

export { backendClient };
