import React from 'react';
import { CircularProgress, Container } from '@mui/material';

export function FullScreenSpinner() {
  return (
    <Container
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress color="primary" size="6rem" thickness={2.5} />
    </Container>
  );
}
