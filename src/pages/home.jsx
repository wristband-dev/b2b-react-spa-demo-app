import React, { useState } from 'react';
import { Button, Container, Divider, Grid, Typography, useTheme } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import { CreateInvoiceDialog, InvoiceTable } from 'components';
import { invoiceHooks, sessionHooks } from 'hooks';
import { util } from 'utils';

export function HomePage() {
  const { data: role } = sessionHooks.useSessionRole();

  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const { data: company } = sessionHooks.useSessionCompany();
  const { data: invoices, error, isInitialLoading: isInvoicesLoading } = invoiceHooks.useInvoices(company.id);
  const invoicesLeft = 5 - invoices?.length;
  const theme = useTheme();

  if (isInvoicesLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your invoices: ' + error.message;
  }
  // return <p>Hello World</p>;
  return (
    <Grid container maxWidth={1200} marginX="auto">
      <Grid item xs={12} margin="2rem" textAlign="center">
        <Typography fontSize="2rem">Send fantastic invoices. Get paid faster.</Typography>
      </Grid>
      <Grid container item xs={12} marginBottom="2rem">
        <Grid item xs={1} sm={2} />
        <Grid container item xs={10} sm={8}>
          <Grid item xs={12} marginY={3} display="flex" alignItems="center" justifyContent="center">
            <WarningIcon sx={{ color: theme.palette.warning.main }} />
            {invoices?.length <= 5 ? (
              <Typography paddingLeft="1rem">
                You have{' '}
                <strong>
                  {invoicesLeft} {invoicesLeft === 1 ? 'invoice ' : 'invoices '}
                </strong>
                left to send to your customers on your current plan.
              </Typography>
            ) : (
              <Typography paddingLeft="1rem">
                You have hit your max invoice limit. To send more invoices, consider upgrading your plan.
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} marginY={5}>
            <CreateInvoiceDialog open={showCreateInvoice} handleClose={() => setShowCreateInvoice(false)} />
            <Typography textAlign="center">Send out a fresh invoice...</Typography>
            <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '15rem' }}>
              <Button
                variant="contained"
                fullWidth
                /* WRISTBAND_TOUCHPOINT - AUTHORIZATION */
                disabled={invoicesLeft === 0 || !util.isOwnerRole(role.name)}
                onClick={() => setShowCreateInvoice(true)}
              >
                NEW INVOICE
              </Button>
            </Container>
          </Grid>
          <Grid item xs={12}>
            <Divider
              sx={{
                '&.MuiDivider-root': {
                  '&::before,&::after': { borderTop: `0.15rem solid ${theme.palette.secondary.main}` },
                },
              }}
            >
              <strong>OR</strong>
            </Divider>
          </Grid>
          <Grid item xs={12} marginY={5}>
            <Typography textAlign="center">Check out your recently sent invoices.</Typography>
            <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto' }}>
              {invoices?.length > 0 ? (
                <InvoiceTable invoices={invoices} />
              ) : (
                <Container
                  sx={{
                    marginTop: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <QuestionMarkIcon sx={{ color: theme.palette.secondary.main, fontSize: '4rem' }} />
                  <Typography marginTop="2rem">
                    {"You don't have any invoices yet. Click the button above to create your first invoice."}
                  </Typography>
                </Container>
              )}
            </Container>
          </Grid>
        </Grid>
        <Grid item xs={1} sm={2} />
      </Grid>
    </Grid>
  );
}
