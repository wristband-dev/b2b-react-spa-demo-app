import axios from 'axios';
import { util } from '../utils';
import { backendService } from '../services';
import {LS_KEY_ACCESS_TOKEN, LS_KEY_EXPIRES_AT, LS_KEY_REFRESH_TOKEN} from "../utils/constants";

// TODO: cannot do keepAlive without hacking it
// useeffect(() => {
//     const interval = setinterval(() => axios.get(url), 5 * 60 * 1000);
//     return () => clearinterval(interval);
//   });

const backendClient = axios.create({
  baseURL: `https://${import.meta.env.VITE_APPLICATION_DOMAIN}/api`,

  // httpAgent: new http.Agent({
  //   maxSockets: 100,
  //   maxFreeSockets: 10,
  //   timeout: 60000,
  //   freeSocketTimeout: 30000
  // }),

});

/* APITOPIA_TOUCHPOINT - AUTHENTICATION */
// Any HTTP 401s should trigger the user to go log in again.  This happens when their
// session cookie has expired and/or the CSRF cookie/header are missing in the request.
// You can optionally catch HTTP 403s as well.
const unauthorizedAccessInterceptor = (error) => {
  if (error.response && [401].includes(error.response.status)) {
    util.redirectToLogin();
  }

  return Promise.reject(error);
};

// backendClient.interceptors.request.use(
//     config => {
//       const accessToken = localStorage.getItem(LS_KEY_ACCESS_TOKEN);
//       const refreshToken = localStorage.getItem(LS_KEY_REFRESH_TOKEN);
//       const expiresAt = localStorage.getItem(LS_KEY_EXPIRES_AT);
//       console.log(`tokenData: ${accessToken}, ${refreshToken}, ${expiresAt}`);
//       if (!accessToken || !expiresAt || !refreshToken) {
//         util.redirectToLogin();
//       }
//
//       if (!util.isAccessTokenExpired(expiresAt)) {
//         return config;
//       }
//
//       const wait = (ms) => new Promise((r) => setTimeout(r, ms));
//       const retryOperation = (operation, delay, retries) => operation().catch(reason => retries > 0 ? wait(delay).then(() => retryOperation(operation, delay, retries-1)) : Promise.reject(reason));
//
//       const throwIfNoResult = (result) => {
//         if (!result) throw new Error("No result");
//         return result;
//       };
//       async function tryRefreshToken(refreshToken, delay = 1000, retries = 2) {
//           const operation = () => backendService.refreshAccessToken(refreshToken).then(throwIfNoResult);
//           const wrapped = retryOperation(operation, delay, retries);
//           return await wrapped;
//       }
//
//       try {
//         const tokenData = tryRefreshToken(tryRefreshToken, 500, 2);
//         console.log(`tokenData: ${JSON.stringify(tokenData)}`);
//         //setSessionTokenData(req, tokenData);
//         return config;
//       } catch (error) {
//         console.error(`Failed to refresh token due to: ${error}`);
//         util.redirectToLogin();
//       }
//
//
//       if (accessToken) {
//         config.headers.common = { Authorization: `Bearer ${accessToken}` };
//       }
//       return config;
//     },
//     error => {
//       Promise.reject(error.response || error.message);
//     }
// );
backendClient.interceptors.response.use(undefined, unauthorizedAccessInterceptor);

export { backendClient };
