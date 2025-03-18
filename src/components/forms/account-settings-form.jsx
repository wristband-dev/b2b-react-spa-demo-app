import React, { useState } from 'react';
import {
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { sessionHooks, settingsHooks } from 'hooks';

export function AccountSettingsForm({ sessionConfigs }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const { data: user } = sessionHooks.useSessionUser();
  const { passwordMinLength, passwordRequired } = sessionConfigs;
  const { data: changeEmailRequests, error, isFetching, isInitialLoading } = settingsHooks.useChangeEmailRequests();
  const { items, totalResults } = changeEmailRequests;
  const hasExistingChangeEmailRequest = totalResults > 0;

  const clearPasswords = () => {
    setCurrentPassword('');
    setNewPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
  };
  const { mutate: changePassword } = settingsHooks.useChangePassword(clearPasswords);
  const { mutate: createChangeEmailRequest } = settingsHooks.useCreateChangeEmailRequest();
  const { mutate: cancelChangeEmailRequest } = settingsHooks.useCancelChangeEmailRequest();

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const flexInputPadding = isSmall ? '0.5rem' : '0';

  const changeEmail = () => {
    createChangeEmailRequest({ newEmail });
  };

  const cancelChangeEmail = () => {
    setNewEmail('');
    cancelChangeEmailRequest({ requestId: items[0].id });
  };

  const updatePassword = () => {
    changePassword({ currentPassword, newPassword });
  };

  if (isInitialLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your change email requests: ' + error.message;
  }

  return (
    <form>
      <Typography margin="1rem 0">
        Email Address:
        <Typography variant="span" sx={{ paddingLeft: '0.5rem' }}>
          <strong>{user.email}</strong>
        </Typography>
      </Typography>
      {hasExistingChangeEmailRequest && (
        <>
          <Typography margin="1rem 0">
            You have requested to change your email address. Instructions have been sent to:
            <Typography variant="span" sx={{ paddingLeft: '0.5rem' }}>
              <strong>{items[0].newEmail}</strong>
            </Typography>
            .
          </Typography>
          <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '10rem' }}>
            <Button variant="contained" color="secondary" fullWidth disabled={isFetching} onClick={cancelChangeEmail}>
              CANCEL
            </Button>
          </Container>
        </>
      )}
      {!hasExistingChangeEmailRequest && (
        <>
          <Typography margin="1rem 0">
            You can change your current email address after confirming your new email address.
          </Typography>
          <FormControl variant="standard" fullWidth sx={{ margin: '0.75rem auto' }}>
            <TextField
              id="new-email"
              label="New Email"
              type="email"
              variant="standard"
              fullWidth
              spellCheck={false}
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
            />
          </FormControl>
          <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '15rem' }}>
            <Button variant="contained" fullWidth disabled={isFetching || !newEmail} onClick={changeEmail}>
              CHANGE EMAIL
            </Button>
          </Container>
        </>
      )}
      {passwordRequired && (
        <>
          <Grid container margin="0.75rem auto" display="flex">
            <Grid item xs={12} margin="1rem 0">
              <Typography>To change your password, please confirm your current password.</Typography>
            </Grid>
            <Grid item xs={12} sm={6} margin="0.75rem auto" paddingRight={flexInputPadding}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="current-password-label" htmlFor="current-password">
                  Current Password
                </InputLabel>
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  variant="standard"
                  fullWidth
                  spellCheck={false}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle current password visibility"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} margin="0.75rem auto" paddingLeft={flexInputPadding}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="new-password-label" htmlFor="new-password">
                  New Password
                </InputLabel>
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  variant="standard"
                  fullWidth
                  spellCheck={false}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle new password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
          <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '15rem' }}>
            <Button
              variant="contained"
              fullWidth
              disabled={isFetching || !currentPassword || newPassword.length < passwordMinLength}
              onClick={updatePassword}
            >
              UPDATE PASSWORD
            </Button>
          </Container>
        </>
      )}
    </form>
  );
}
