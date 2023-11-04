import React, { useState } from 'react';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, useMediaQuery, useTheme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { addDays, formatISO } from 'date-fns';
import { NumericFormat } from 'react-number-format';

import { invoiceHooks, sessionHooks } from 'hooks';
import { constants } from 'utils';

export function CreateInvoiceForm({ closeFormDialog, invoiceNumber }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [terms, setTerms] = useState('DUE_ON_RECEIPT');
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [totalDue, setTotalDue] = useState(null);

  const { data: company } = sessionHooks.useSessionCompany();
  const { mutate: createInvoice, isSubmitting } = invoiceHooks.useCreateInvoice(closeFormDialog);

  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));
  const flexInputPadding = isMedium ? '0.5rem' : '0';

  const handleSubmit = () => {
    createInvoice({
      companyId: company.id,
      invoiceNumber: invoiceNumber,
      customerName: customerName,
      customerEmail: customerEmail,
      billingAddress: billingAddress,
      terms: terms,
      invoiceDate: formatISO(invoiceDate, { representation: 'date' }),
      dueDate: formatISO(dueDate, { representation: 'date' }),
      message: message,
      totalDue: parseFloat(totalDue).toFixed(2),
    });
  };

  const onAddressChange = (value) => {
    if (!value || value.length <= 200) {
      setBillingAddress(value);
    }
  };

  const onMessageChange = (value) => {
    if (!value || value.length <= 500) {
      setMessage(value);
    }
  };

  const onTermsChange = (value) => {
    switch (value) {
      case 'DUE_ON_RECEIPT':
        setDueDate(invoiceDate);
        break;
      case 'NET_7':
        setDueDate(addDays(invoiceDate, 7));
        break;
      case 'NET_15':
        setDueDate(addDays(invoiceDate, 15));
        break;
      case 'NET_30':
        setDueDate(addDays(invoiceDate, 30));
        break;
      default:
        throw new Error('Invalid terms');
    }
    setTerms(value);
  };

  const onInvoiceDateChange = (value) => {
    switch (terms) {
      case 'DUE_ON_RECEIPT':
        setDueDate(value);
        break;
      case 'NET_7':
        setDueDate(addDays(value, 7));
        break;
      case 'NET_15':
        setDueDate(addDays(value, 15));
        break;
      case 'NET_30':
        setDueDate(addDays(value, 30));
        break;
      default:
        throw new Error('Invalid terms');
    }
    setInvoiceDate(value);
  };

  // Super crude form validation :o)
  const submitEnabled =
    customerName && customerEmail && billingAddress && terms && invoiceDate && dueDate && message && totalDue;

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
        <Grid item xs={12} margin="0.75rem auto">
          <FormControl variant="standard" fullWidth>
            <TextField
              id="billing-address"
              label="Billing Address"
              type="text"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={5}
              spellCheck={false}
              value={billingAddress}
              onChange={(event) => onAddressChange(event.target.value)}
              sx={{ '& textarea': { fontSize: '14px', letterSpacing: '0.2px', lineHeight: '1.5' } }}
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
            <InputLabel id="terms-label" required>
              Terms
            </InputLabel>
            <Select
              labelId="terms-select-label"
              id="terms-select-label"
              label="Terms"
              fullWidth
              required
              value={terms}
              onChange={(event) => onTermsChange(event.target.value)}
            >
              {constants.INVOICE_TERMS.map((term) => (
                <MenuItem key={term.value} value={term.value}>
                  {term.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container margin="0.75rem auto" display="flex">
        <Grid item xs={12} md={6} margin="0.75rem auto" paddingRight={flexInputPadding}>
          <FormControl variant="standard" fullWidth>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                id="invoice-date"
                label="Invoice Date"
                inputFormat="MM/dd/yyyy"
                disableFuture
                value={invoiceDate}
                onChange={(value) => onInvoiceDateChange(value)}
                slotProps={{ textField: { variant: 'standard' } }}
              />
            </LocalizationProvider>
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
      <Grid container margin="0.75rem auto" display="flex">
        <Grid item xs={12} margin="0.75rem auto">
          <FormControl variant="standard" fullWidth>
            <TextField
              id="message"
              label="Message on Invoice"
              type="text"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={5}
              spellCheck={false}
              value={message}
              onChange={(event) => onMessageChange(event.target.value)}
              sx={{ '& textarea': { fontSize: '14px', letterSpacing: '0.2px', lineHeight: '1.5' } }}
            />
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
