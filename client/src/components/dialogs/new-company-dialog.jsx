import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material';

import { NewCompanyForm } from 'components';

export function NewCompanyDialog({ companyId, open }) {
  return (
    <Dialog keepMounted={false} fullScreen open={open}>
      <Grid container maxWidth={1200} marginX="auto">
        <Grid item xs={12}>
          <DialogTitle marginTop="2rem" textAlign="center">
            <Typography fontSize="2rem">Getting Started</Typography>
          </DialogTitle>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={1} sm={2} />
          <Grid item xs={10} sm={8}>
            <DialogContent>
              <DialogContentText marginBottom="2rem">
                Welcome to Invotastic! Before you can start sending invoices, please fill out the following information
                about your company:
              </DialogContentText>
              <NewCompanyForm companyId={companyId} />
            </DialogContent>
          </Grid>
          <Grid item xs={1} sm={2} />
        </Grid>
      </Grid>
    </Dialog>
  );
}
