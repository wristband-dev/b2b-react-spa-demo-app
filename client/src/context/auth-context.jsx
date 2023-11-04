import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { sessionService } from '../services';
import { util } from '../utils';

const initialState = { isAuthenticated: false };
const UPDATE_AUTH = 'UPDATE_AUTH';

const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

function AuthReducer(state, action) {
  switch (action.type) {
    case UPDATE_AUTH:
      return { ...state, isAuthenticated: action.isAuthenticated };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = React.useReducer(AuthReducer, initialState);
  const queryClient = useQueryClient();

  const bootstrapSession = React.useCallback(async () => {
    try {
      const isAuthenticated = sessionService.getAuthState();
      if (!isAuthenticated) {
        util.redirectToLogin();
      } else {
        // We make one call to load all session data to reduce network requests, and then split up the
        // results into separate cache keys since each key could read/write indepenently of each other.
        const sessionData = await sessionService.getInitialSessionData();
        const { assignedRole, company, configs, user } = sessionData;
        queryClient.setQueryData(['session-user'], user);
        queryClient.setQueryData(['session-role'], assignedRole);
        queryClient.setQueryData(['session-company'], company);
        queryClient.setQueryData(['session-configs'], configs);

        dispatch({ type: UPDATE_AUTH, isAuthenticated: true });
      }
    } catch (error) {
      console.log(error);
      util.redirectToLogout();
    }
  }, [queryClient]);

  React.useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

function useAuthState() {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
}

/*
 * If you want to make the auth context mutable, add this function to the exports list.  However, it is
 * highly advised for the auth context to remain immutable and adhere to a single-responsibility.
 */
// function useAuthDispatch() {
//   const context = React.useContext(AuthDispatchContext);
//   if (context === undefined) {
//     throw new Error('useAuthDispatch must be used within a AuthProvider');
//   }
//   return context;
// }

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
// React context responsbile for establishing that the user is authenticated and getting session data.
// "AuthProvider" should wrap your App component to enable access to the "useAuthState" hook everywhere.
// That hook can then be used to protect App routes.
export { AuthProvider, useAuthState };
