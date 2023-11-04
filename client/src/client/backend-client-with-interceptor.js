import axios from 'axios';
import { util } from '../utils';
import { backendService } from '../services';
import {LS_KEY_ACCESS_TOKEN, LS_KEY_EXPIRES_AT, LS_KEY_REFRESH_TOKEN} from "../utils/constants";

// TODO: cannot do keepAlive without hacking it
// useeffect(() => {
//     const interval = setinterval(() => axios.get(url), 5 * 60 * 1000);
//     return () => clearinterval(interval);
//   });

const backendClientWithInterceptor = axios.create({
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

const refreshExpiredTokenClosure =  () => {
    let isCalled = false;
    let runningPromise = undefined;
    return  () => {
        if (isCalled) {
            return runningPromise;
        } else {
            isCalled = true;
            runningPromise =  backendService.refreshAccessToken(localStorage.getItem(LS_KEY_REFRESH_TOKEN)).then(util.throwIfNoResult);
            return runningPromise;
        }
    };
};

// stores the function returned by refreshExpiredTokenClosure
const refreshExpiredToken = refreshExpiredTokenClosure();


export async function tryRefreshToken( delay = 1000, retries = 2) {
    const wrapped = util.retryOperation(refreshExpiredTokenClosure, delay, retries);
    return await wrapped;
}






export async function refreshIfExpired(config) {
    const accessToken = localStorage.getItem(LS_KEY_ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(LS_KEY_REFRESH_TOKEN);
    const expiresAt = localStorage.getItem(LS_KEY_EXPIRES_AT);
    //console.log(`tokenData: ${accessToken}, ${refreshToken}, ${expiresAt}`);
    if (!accessToken || !expiresAt || !refreshToken) {
        util.redirectToLogin();
    }

    if (!util.isAccessTokenExpired(expiresAt)) {
        return config;
    }
    // pre-emptive refreshToken
    try {
        const tokenData = await refreshExpiredToken();
        //tryRefreshToken(1000, 2);

        if( tokenData != null){
            //console.log(`tokenData: ${JSON.stringify(tokenData)}`);
            localStorage.setItem(LS_KEY_ACCESS_TOKEN, tokenData.access_token);
            localStorage.setItem(LS_KEY_EXPIRES_AT, util.calculateExpTimeWithBuffer(tokenData.expires_in))
            localStorage.setItem(LS_KEY_REFRESH_TOKEN, tokenData.refresh_token);
            config.headers.common = { Authorization: `Bearer ${ tokenData.access_token}` };
        }
        return config;
    } catch (error) {
        console.error(`Failed to refresh token due to: ${error}`);
        util.redirectToLogin();
    }

}


backendClientWithInterceptor.interceptors.request.use( refreshIfExpired,
    error => {
      Promise.reject(error.response || error.message);
    }
);

backendClientWithInterceptor.interceptors.response.use(undefined, unauthorizedAccessInterceptor);

export { backendClientWithInterceptor };
