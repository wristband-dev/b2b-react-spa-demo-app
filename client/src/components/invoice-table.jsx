import React, { useState } from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import FindInPageIcon from '@mui/icons-material/FindInPage';

import { ViewInvoiceDialog } from 'components';
import { invoiceHooks, sessionHooks } from 'hooks';
import { constants, util } from 'utils';

export function InvoiceTable({ invoices = [] }) {
  const { data: role } = sessionHooks.useSessionRole();

  const [showViewInvoice, setShowViewInvoice] = useState(false);
  const { mutate: cancelInvoice } = invoiceHooks.useUpdateInvoice();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="invoice table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Date</TableCell>
            <TableCell align="right">Number</TableCell>
            <TableCell align="right">Customer</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {invoice.invoiceDate}
              </TableCell>
              <TableCell align="right">{invoice.invoiceNumber}</TableCell>
              <TableCell align="right">{invoice.customerName}</TableCell>
              <TableCell align="right">{'$ ' + invoice.totalDue}</TableCell>
              <TableCell align="right">{util.toCapitalizedCase(invoice.status)}</TableCell>
              <TableCell align="center">
                {invoice.status !== 'CANCELLED' && (
                  <>
                    <ViewInvoiceDialog
                      invoice={invoice}
                      open={showViewInvoice}
                      handleClose={() => setShowViewInvoice(false)}
                    />
                    <IconButton aria-label="View Invoice" title="View Invoice" onClick={() => setShowViewInvoice(true)}>
                      <FindInPageIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Cancel Invoice"
                      title="Cancel Invoice"
                      /* WRISTBAND_TOUCHPOINT - AUTHORIZATION */
                      disabled={role.name !== constants.OWNER_ROLE}
                      onClick={() => cancelInvoice({ id: invoice.id, status: 'CANCELLED' })}
                    >
                      <DoNotDisturbIcon />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
