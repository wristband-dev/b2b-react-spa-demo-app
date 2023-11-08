import React, { useState } from 'react';
import {
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import MuiPhoneNumber from 'material-ui-phone-number';
import { formatISO, parseISO } from 'date-fns';

import { sessionHooks } from 'hooks';
import { util } from 'utils';

export function ProfileSettingsForm({ sessionConfigs }) {
  const { data: user, error, isFetching, isInitialLoading } = sessionHooks.useSessionUser();
  const { mutate: updateUser } = sessionHooks.useUpdateSessionUser();
  const { usernameRequired, requiredFields } = sessionConfigs;

  const [fullName, setFullName] = useState(user.fullName ?? '');
  const [firstName, setFirstName] = useState(user.givenName ?? '');
  const [lastName, setLastName] = useState(user.familyName ?? '');
  const [username, setUsername] = useState(user.username ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? '');
  const [birthdate, setBirthdate] = useState(user.birthdate ? parseISO(user.birthdate) : null);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const flexInputPadding = isSmall ? '0.5rem' : '0';

  const updateUserInfo = () => {
    updateUser({
      id: user.id,
      fullName,
      givenName: firstName,
      familyName: lastName,
      username,
      phoneNumber,
      birthdate: birthdate ? formatISO(birthdate, { representation: 'date' }) : null,
    });
  };

  if (isInitialLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your user: ' + error.message;
  }

  return (
    <form>
      {requiredFields.includes('fullName') && (
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
      )}
      {['givenName', 'familyName'].every((field) => requiredFields.includes(field)) && (
        <Grid container margin="0.75rem auto" display="flex">
          <Grid item xs={12} sm={6} margin="0.75rem auto" paddingRight={flexInputPadding}>
            <FormControl variant="standard" fullWidth>
              <TextField
                id="first-name"
                label="First Name"
                type="text"
                variant="standard"
                required
                fullWidth
                spellCheck={false}
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} margin="0.75rem auto" paddingLeft={flexInputPadding}>
            <FormControl variant="standard" fullWidth>
              <TextField
                id="last-name"
                label="Last Name"
                type="text"
                variant="standard"
                required
                fullWidth
                spellCheck={false}
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </FormControl>
          </Grid>
        </Grid>
      )}
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
      <Grid container margin="0.75rem auto" display="flex">
        <Grid item xs={12} sm={6} margin="0.75rem auto" paddingRight={flexInputPadding}>
          <FormControl variant="standard" fullWidth>
            <MuiPhoneNumber
              id="phone-number"
              label="Phone Number"
              value={phoneNumber}
              required={requiredFields.includes('phoneNumber')}
              defaultCountry={'us'}
              onChange={(value) => setPhoneNumber(value)}
              sx={{ svg: { height: '1.25rem' } }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} margin="0.75rem auto" paddingLeft={flexInputPadding}>
          <FormControl variant="standard" fullWidth>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                id="birthdate"
                variant="standard"
                label="Birthdate"
                inputFormat="MM/dd/yyyy"
                disableFuture
                value={birthdate}
                onChange={(value) => setBirthdate(value)}
                slotProps={{
                  textField: {
                    InputProps: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton sx={{ padding: '0.25rem' }} onClick={() => setBirthdate(null)}>
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                    required: requiredFields.includes('birthdate'),
                    variant: 'standard',
                  },
                }}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>
      </Grid>
      <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '10rem' }}>
        <Button
          variant="contained"
          fullWidth
          disabled={isFetching || (requiredFields.includes('phoneNumber') && util.isEmptyPhoneNumber(phoneNumber))}
          onClick={updateUserInfo}
        >
          SAVE
        </Button>
      </Container>
    </form>
  );
}
