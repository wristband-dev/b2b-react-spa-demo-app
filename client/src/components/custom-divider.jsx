import React from 'react';
import { Divider, useTheme } from '@mui/material';

export function CustomDivider() {
  const theme = useTheme();

  return (
    <Divider sx={{ borderWidth: '0.05rem', margin: '0 auto', width: '75%' }} color={theme.palette.secondary.main} />
  );
}
