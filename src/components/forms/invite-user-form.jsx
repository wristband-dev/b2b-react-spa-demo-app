import React, { useEffect, useState } from 'react';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

import { settingsHooks } from 'hooks';

export function InviteUserForm() {
  const [assignedRole, setAssignedRole] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const { data: assignableRoleOptions } = settingsHooks.useAssignableRoleOptions();
  const { data: invites, error, isFetching, isInitialLoading } = settingsHooks.useNewUserInvites();
  const { data: userCount } = settingsHooks.useUserCount();
  const { mutate: cancelNewUserInvite } = settingsHooks.useCancelNewUserInvite();
  const { mutate: createNewUserInvite } = settingsHooks.useCreateNewUserInvite();
  const userLimitReached = userCount > 1;
  const { items, totalResults } = invites;
  const hasExistingInvite = totalResults > 0;

  useEffect(() => {
    if (!!assignableRoleOptions.length && !assignedRole) {
      setAssignedRole(assignableRoleOptions[0].value);
    }
  }, [assignableRoleOptions, assignableRoleOptions.length, assignedRole]);

  const inviteUser = () => {
    createNewUserInvite({ email: adminEmail, roleId: assignedRole });
  };

  const cancelInvite = () => {
    setAdminEmail('');
    setAssignedRole(assignableRoleOptions[0].value);
    cancelNewUserInvite(items[0].id);
  };

  if (isInitialLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred retrieving your new user invites: ' + error.message;
  }

  return (
    <form>
      {userLimitReached && (
        <Typography margin="1rem 0">
          You have reached the maximum number of users for your current plan. To add more users, consider upgrading your
          plan.
        </Typography>
      )}
      {!userLimitReached && hasExistingInvite && (
        <>
          <Typography margin="1rem 0">
            The invitation email has been sent to:
            <Typography variant="span" sx={{ paddingLeft: '0.5rem' }}>
              <strong>{items[0].email}</strong>
            </Typography>
            .
          </Typography>
          <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '10rem' }}>
            <Button variant="contained" color="secondary" fullWidth disabled={isFetching} onClick={cancelInvite}>
              CANCEL
            </Button>
          </Container>
        </>
      )}
      {!userLimitReached && !hasExistingInvite && (
        <>
          <Typography margin="1rem 0">
            You can invite one more teammate to become an Invotastic admin for your company.
          </Typography>
          <FormControl variant="standard" fullWidth sx={{ margin: '0.75rem auto' }}>
            <TextField
              id="admin-email"
              label="Admin Email"
              type="email"
              variant="standard"
              fullWidth
              spellCheck={false}
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
            />
          </FormControl>
          <FormControl variant="standard" fullWidth sx={{ margin: '0.75rem auto' }}>
            <InputLabel id="assigned-role-label">Assigned Role</InputLabel>
            <Select
              labelId="assigned-role-label"
              id="assigned-role"
              value={assignedRole}
              onChange={(event) => {
                setAssignedRole(event.target.value);
              }}
            >
              {!!assignableRoleOptions.length &&
                assignableRoleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Container sx={{ display: 'flex', justifyContent: 'center', margin: '2rem auto', width: '10rem' }}>
            <Button
              fullWidth
              variant="contained"
              disabled={isFetching || !adminEmail || !assignedRole}
              onClick={inviteUser}
            >
              INVITE
            </Button>
          </Container>
        </>
      )}
    </form>
  );
}
