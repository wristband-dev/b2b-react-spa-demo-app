import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    spacing: (factor) => `${0.25 * factor}rem`,
    background: {
      default: '#fafafa',
      paper: '#fff',
    },
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.54)',
      disabled: 'rgba(0,0,0,0.38)',
      hint: 'rgba(0,0,0,0.38)',
    },
    primary: {
      main: '#4156a3',
      light: 'rgb(103,119,181)',
      dark: 'rgb(45,60,114)',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ebda58',
      light: 'rgb(239,225,121)',
      dark: 'rgb(164,152,61)',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    divider: 'rgba(0,0,0,0.12)',
  },
});
