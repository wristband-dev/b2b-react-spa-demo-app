import React from 'react';
import { Chip } from '@mui/material';

export function TouchpointChip() {
  return (
    <Chip
      label="Wristband Touchpoint"
      sx={{
        backgroundColor: '#7de3ff',
        fontSize: '0.75rem',
        fontWeight: '600',
        height: '1.75rem',
      }}
    />
  );
}
