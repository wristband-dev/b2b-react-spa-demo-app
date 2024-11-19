import React, { useState } from 'react';
import { Button, Container, FormControl, TextField } from '@mui/material';

import { sessionHooks } from 'hooks';

export function ProfileSettingsForm({ sessionConfigs }) {
  const { data: user, error, isFetching, isInitialLoading } = sessionHooks.useSessionUser();
  const { mutate: updateUser } = sessionHooks.useUpdateSessionUser();
  const { usernameRequired, requiredFields } = sessionConfigs;

  const [fullName, setFullName] = useState(user.fullName ?? '');
  const [username, setUsername] = useState(user.username ?? '');

  const updateUserInfo = () => {
    updateUser({ id: user.id, fullName, username });
  };

  if (isInitialLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your user: ' + error.message;
  }

  return (
    <form>
      <FormControl variant="standard" fullWidth sx={{ margin: '0.75rem auto', paddingRight: '0.5rem' }}>
        <TextField
          id="full-name"
          label="Full Name"
          type="text"
          variant="standard"
          required
          fullWidth
          spellCheck={false}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
      </FormControl>
      {usernameRequired && (
        <FormControl variant="standard" fullWidth sx={{ margin: '0.75rem auto' }}>
          <TextField
            id="username"
            label="Username"
            type="text"
            variant="standard"
            required
            fullWidth
            spellCheck={false}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </FormControl>
      )}
      <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '10rem' }}>
        <Button
          variant="contained"
          fullWidth
          disabled={isFetching || (requiredFields.includes('fullName') && !fullName)}
          onClick={updateUserInfo}
        >
          SAVE
        </Button>
      </Container>
    </form>
  );
}
