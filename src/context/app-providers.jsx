import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { theme } from 'themes';
import { AuthProvider } from 'context';
import { LoginPage, CallbackPage } from 'pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (count, { response }) => {
        if (response != null && response.status != null && ['401', '403'].includes(response.status)) {
          return false;
        }
        return count < 3;
      },
      staleTime: 30000,
    },
  },
});

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <Routes>
        {/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */}
        {/* We want to keep login and callback above everything else in the component tree in order to
            avoid a full page load during redirects. */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route
          path="*"
          element={
            <QueryClientProvider client={queryClient}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <SnackbarProvider anchorOrigin={{ horizontal: 'center', vertical: 'top' }} maxSnack={3}>
                  {/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */}
                  <AuthProvider>{children}</AuthProvider>
                </SnackbarProvider>
              </ThemeProvider>
              <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
            </QueryClientProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
