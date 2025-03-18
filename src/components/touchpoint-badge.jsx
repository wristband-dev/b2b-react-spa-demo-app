import React from 'react';
import { Badge } from '@mui/material';

export function TouchpointBadge({ anchor, children, sxStyle }) {
  return (
    <Badge
      badgeContent="Wristband Touchpoint"
      anchorOrigin={anchor}
      sx={{
        '& span': {
          ...sxStyle,
          backgroundColor: '#7de3ff',
          color: '#000',
          fontWeight: '600',
        },
      }}
    >
      {children}
    </Badge>
  );
}
