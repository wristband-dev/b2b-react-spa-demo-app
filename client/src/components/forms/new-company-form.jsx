import React, { useState } from 'react';
import {
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { sessionHooks } from 'hooks';
import { constants } from 'utils';

export function NewCompanyForm({ companyId }) {
  const [companyName, setCompanyName] = useState('');
  const [invoiceEmail, setInvoiceEmail] = useState('');
  const [street1, setStreet1] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('AL');
  const [zipCode, setZipCode] = useState('');

  const { mutate: createCompany, isInitialLoading: isSubmitting } = sessionHooks.useCreateSessionCompany();

  const handleSubmit = () => {
    createCompany({
      id: companyId,
      displayName: companyName,
      invoiceEmail,
      address: { street1, street2, city, state, zipCode },
    });
  };

  // Super crude form validation :o)
  const submitEnabled = companyName && invoiceEmail && street1 && city && state && zipCode && zipCode.length === 5;

  return (
    <form>
      <FormControl variant="standard" fullWidth sx={{ margin: '0.75rem auto' }}>
        <TextField
          id="company-name"
          label="Company Name"
          type="text"
          variant="standard"
          fullWidth
          required
          spellCheck={false}
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
        />
      </FormControl>
      <FormControl variant="standard" fullWidth sx={{ margin: '0.75rem auto' }}>
        <TextField
          id="invoice-email"
          label="Invoice Email Address"
          type="email"
          variant="standard"
          fullWidth
          required
          spellCheck={false}
          value={invoiceEmail}
          onChange={(event) => setInvoiceEmail(event.target.value)}
        />
        <FormHelperText>
          This is the company email address that appears on invoices to your customers. You should pick an address that
          customers can reply to.
        </FormHelperText>
      </FormControl>
      <Container sx={{ margin: '4rem 0 0', padding: '0 !important' }}>
        <Typography sx={{ fontSize: '1.25rem' }}>Company Address</Typography>
      </Container>
      <FormControl variant="standard" fullWidth sx={{ margin: '0.75rem auto' }}>
        <TextField
          id="street1"
          label="Street 1"
          type="text"
          variant="standard"
          fullWidth
          required
          spellCheck={false}
          value={street1}
          onChange={(event) => setStreet1(event.target.value)}
        />
      </FormControl>
      <FormControl variant="standard" fullWidth sx={{ margin: '0.75rem auto' }}>
        <TextField
          id="street2"
          label="Street 2"
          type="text"
          variant="standard"
          fullWidth
          spellCheck={false}
          value={street2}
          onChange={(event) => setStreet2(event.target.value)}
        />
      </FormControl>
      <FormControl variant="standard" fullWidth>
        <TextField
          id="city"
          label="City"
          type="text"
          variant="standard"
          fullWidth
          required
          spellCheck={false}
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
      </FormControl>
      <Container disableGutters sx={{ display: 'flex', flexDirection: 'row', margin: '0.75rem auto 3rem' }}>
        <FormControl variant="standard" sx={{ flex: '1 1' }}>
          <InputLabel id="state-label">State</InputLabel>
          <Select
            labelId="state-select-label"
            id="state-select-label"
            label="State"
            fullWidth
            required
            value={state}
            onChange={(event) => setState(event.target.value)}
          >
            {constants.STATES.map((state) => (
              <MenuItem key={state.value} value={state.value}>
                {state.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ flex: '2 1', paddingLeft: '2rem' }}>
          <TextField
            id="zip-code"
            label="Zip Code"
            type="text"
            variant="standard"
            fullWidth
            required
            spellCheck={false}
            value={zipCode}
            onChange={(event) => setZipCode(event.target.value)}
          />
        </FormControl>
      </Container>
      <LoadingButton
        loading={isSubmitting}
        disabled={!submitEnabled}
        variant="contained"
        fullWidth
        onClick={handleSubmit}
      >
        {"LET'S GO!"}
      </LoadingButton>
    </form>
  );
}
