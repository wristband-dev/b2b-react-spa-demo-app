import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { sessionService } from '../services';
import { auth } from '../utils';

const AuthContext = createContext({ isAuthenticated: false, isLoading: true });

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Bootstrap the application with the authenticated user's session data.
  useEffect(() => {
    const fetchSession = async () => {
      const isAuthenticated = sessionService.getAuthState();

      if (!isAuthenticated) {
        await auth.login();
        return;
      }

      try {
        const sessionData = await sessionService.getInitialSessionData();
        const { assignedRole, company, configs, user } = sessionData;
        queryClient.setQueryData(['session-user'], user);
        queryClient.setQueryData(['session-role'], assignedRole);
        queryClient.setQueryData(['session-company'], company);
        queryClient.setQueryData(['session-configs'], configs);

        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        await auth.logout();
      }
    };

    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
// React context responsbile for establishing that the user is authenticated and getting session data.
// "AuthProvider" should wrap your App component to enable access to the "useAuth" hook everywhere.
// That hook can then be used to protect App routes.
export { AuthProvider, useAuth };
