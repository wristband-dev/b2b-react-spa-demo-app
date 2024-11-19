import React, { useState } from 'react';
import { Button, Container, FormControl, TextField } from '@mui/material';

import { sessionHooks } from 'hooks';

export function CompanySettingsForm() {
  const { data: company, error, isFetching, isInitialLoading } = sessionHooks.useSessionCompany();
  const { mutate: updateCompany } = sessionHooks.useUpdateSessionCompany();

  const [companyName, setCompanyName] = useState(company.displayName);

  const updateCompanyInfo = () => {
    updateCompany({ id: company.id, displayName: companyName });
  };

  if (isInitialLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your company: ' + error.message;
  }

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
      <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '10rem' }}>
        <Button variant="contained" fullWidth disabled={!companyName || isFetching} onClick={updateCompanyInfo}>
          SAVE
        </Button>
      </Container>
    </form>
  );
}
