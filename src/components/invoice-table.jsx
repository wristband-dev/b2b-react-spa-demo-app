import React from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

import { invoiceHooks, sessionHooks } from 'hooks';
import { util } from 'utils';

export function InvoiceTable({ invoices = [] }) {
  const { data: role } = sessionHooks.useSessionRole();
  const { mutate: cancelInvoice } = invoiceHooks.useDeleteInvoice();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="invoice table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Customer Name</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Amount</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {`${invoice.id.substring(0, 6)}...`}
              </TableCell>
              <TableCell align="left">{invoice.dueDate}</TableCell>
              <TableCell align="left">{invoice.customerName}</TableCell>
              <TableCell align="left">{invoice.customerEmail}</TableCell>
              <TableCell align="left">{'$ ' + invoice.totalDue}</TableCell>
              <TableCell align="center">
                <>
                  <IconButton
                    aria-label="Cancel Invoice"
                    title="Cancel Invoice"
                    /* WRISTBAND_TOUCHPOINT - AUTHORIZATION */
                    disabled={!util.isOwnerRole(role.name)}
                    onClick={() => cancelInvoice(invoice.id)}
                  >
                    <DoNotDisturbIcon />
                  </IconButton>
                </>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
