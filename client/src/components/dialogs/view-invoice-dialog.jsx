import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { CustomDivider } from 'components';
import { sessionHooks } from 'hooks';
import { Icon } from 'images';
import { constants } from 'utils';

export function ViewInvoiceDialog({ handleClose, invoice, open }) {
  const { data: company } = sessionHooks.useSessionCompany();
  const theme = useTheme();

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <AppBar color="transparent" position="sticky">
        <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container maxWidth={1200} marginX="auto">
        <Grid container item xs={12} marginY="2rem">
          <Grid item xs={1} />
          <Grid item xs={10}>
            <DialogContent>
              <Grid container marginY="2rem">
                <Grid item xs={6}>
                  <Typography variant="h6" fontWeight={600}>
                    {company.name}
                  </Typography>
                  <Typography whiteSpace="pre-wrap">{invoice.fromAddress}</Typography>
                  <Typography>{invoice.fromEmail}</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Box component="img" sx={{ height: '5rem' }} alt="Icon" src={Icon} />
                </Grid>
                <Grid item xs={12} marginTop="4rem">
                  <Typography color={theme.palette.primary.main} variant="h3">
                    INVOICE
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={5} marginTop="2rem">
                  <Typography variant="h6" fontWeight={600}>
                    BILL TO
                  </Typography>
                  <Typography>{invoice.customerName}</Typography>
                  <Typography whiteSpace="pre-wrap">{invoice.billingAddress}</Typography>
                  <Typography>{invoice.customerEmail}</Typography>
                </Grid>
                <Grid item xs={0} sm={2} />
                <Grid item xs={12} sm={5} marginTop="2rem" display="flex" flexDirection="row">
                  <Container disableGutters sx={{ textAlign: 'right' }}>
                    <Typography fontWeight={600}>Invoice #:</Typography>
                    <Typography fontWeight={600}>Date:</Typography>
                    <Typography fontWeight={600}>Due Date:</Typography>
                    <Typography fontWeight={600}>Terms:</Typography>
                  </Container>
                  <Container disableGutters sx={{ paddingLeft: '0.5rem', textAlign: 'left' }}>
                    <Typography>{invoice.invoiceNumber}</Typography>
                    <Typography>{invoice.invoiceDate}</Typography>
                    <Typography>{invoice.dueDate}</Typography>
                    <Typography>
                      {constants.INVOICE_TERMS.find((term) => term.value === invoice.terms).label}
                    </Typography>
                  </Container>
                </Grid>
                <Grid item xs={12} marginY="2rem">
                  <CustomDivider />
                </Grid>
                <Grid item xs={12}>
                  <Typography whiteSpace="pre-wrap" textAlign="justified">
                    {invoice.message}
                  </Typography>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  marginTop="3rem"
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography variant="h6" fontWeight={600} textAlign="center">
                    BALANCE DUE
                  </Typography>
                  <Typography variant="h6" paddingLeft="2rem" textAlign="center">
                    $ {invoice.totalDue}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </Grid>
    </Dialog>
  );
}
