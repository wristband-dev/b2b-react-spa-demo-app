import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { theme } from 'themes';
import { AuthProvider } from 'context';
import { LoginPage, CallbackPage} from 'pages';

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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider anchorOrigin={{ horizontal: 'center', vertical: 'top' }} maxSnack={3}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/callback" element={<CallbackPage />} />
              {/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */}
              <Route
                  path="*"
                  element={
                    <AuthProvider>{children}</AuthProvider>
                  }
              />
            </Routes>
          </SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}
