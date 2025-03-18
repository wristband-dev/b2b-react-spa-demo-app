import React, { useState } from 'react';
import { FormControl, Grid, TextField, useMediaQuery, useTheme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { formatISO } from 'date-fns';
import { NumericFormat } from 'react-number-format';

import { invoiceHooks, sessionHooks } from 'hooks';

export function CreateInvoiceForm({ closeFormDialog }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [totalDue, setTotalDue] = useState(null);

  const { data: company } = sessionHooks.useSessionCompany();
  const { mutate: createInvoice, isSubmitting } = invoiceHooks.useCreateInvoice(closeFormDialog);

  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));
  const flexInputPadding = isMedium ? '0.5rem' : '0';

  const handleSubmit = () => {
    createInvoice({
      companyId: company.id,
      customerName: customerName,
      customerEmail: customerEmail,
      dueDate: formatISO(dueDate, { representation: 'date' }),
      totalDue: parseFloat(totalDue).toFixed(2),
    });
  };

  // Super crude form validation :o)
  const submitEnabled = customerName && customerEmail && dueDate && totalDue;

  return (
    <form>
      <Grid container margin="0.75rem auto" display="flex">
        <Grid item xs={12} md={6} margin="0.75rem auto" paddingRight={flexInputPadding}>
          <FormControl variant="standard" fullWidth>
            <TextField
              id="customer-name"
              label="Customer Name"
              type="text"
              variant="standard"
              fullWidth
              required
              spellCheck={false}
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} margin="0.75rem auto" paddingLeft={flexInputPadding}>
          <FormControl variant="standard" fullWidth>
            <TextField
              id="customer-email"
              label="Customer Email Address"
              type="email"
              variant="standard"
              fullWidth
              required
              spellCheck={false}
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container margin="0.75rem auto" display="flex">
        <Grid item xs={12} md={6} margin="0.75rem auto" paddingRight={flexInputPadding}>
          <FormControl variant="standard" fullWidth>
            <NumericFormat
              customInput={TextField}
              autoComplete="off"
              allowNegative={false}
              decimalScale={2}
              decimalSeparator="."
              displayType="input"
              label="Total Due"
              onValueChange={(values) => setTotalDue(values.value)}
              prefix="$ "
              required
              thousandsGroupStyle="thousand"
              thousandSeparator={true}
              type="text"
              value={totalDue}
              valueIsNumericString={true}
              variant="standard"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} margin="0.75rem auto" paddingLeft={flexInputPadding}>
          <FormControl variant="standard" fullWidth>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                id="due-date"
                label="Due Date"
                inputFormat="MM/dd/yyyy"
                value={dueDate}
                onChange={(value) => setDueDate(value)}
                slotProps={{ textField: { variant: 'standard' } }}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>
      </Grid>
      <LoadingButton
        loading={isSubmitting}
        disabled={!submitEnabled}
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{ marginTop: '2rem' }}
      >
        {'CREATE & SEND'}
      </LoadingButton>
    </form>
  );
}
