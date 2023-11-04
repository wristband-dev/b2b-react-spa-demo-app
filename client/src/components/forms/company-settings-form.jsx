import React, { useState } from 'react';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

import { sessionHooks } from 'hooks';
import { constants } from 'utils';

export function CompanySettingsForm() {
  const { data: company, error, isFetching, isInitialLoading } = sessionHooks.useSessionCompany();
  const { mutate: updateCompany } = sessionHooks.useUpdateSessionCompany();

  const [companyName, setCompanyName] = useState(company.displayName);
  const [invoiceEmail, setInvoiceEmail] = useState(company.invoiceEmail);
  const [street1, setStreet1] = useState(company.address.street1);
  const [street2, setStreet2] = useState(company.address.street2);
  const [city, setCity] = useState(company.address.city);
  const [state, setState] = useState(company.address.state);
  const [zipCode, setZipCode] = useState(company.address.zipCode);

  const updateCompanyInfo = () => {
    updateCompany({
      id: company.id,
      displayName: companyName,
      invoiceEmail,
      address: { street1, street2, city, state, zipCode },
    });
  };

  if (isInitialLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your company: ' + error.message;
  }

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
      </FormControl>
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
      <FormControl variant="standard" fullWidth sx={{ margin: '0.75rem auto' }}>
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
          <InputLabel id="state-label" required>
            State
          </InputLabel>
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
      <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '10rem' }}>
        <Button variant="contained" fullWidth disabled={!submitEnabled || isFetching} onClick={updateCompanyInfo}>
          SAVE
        </Button>
      </Container>
    </form>
  );
}
