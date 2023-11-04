import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Divider, Drawer, IconButton, List, ListItem, ListItemText, Typography, styled, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

import { TouchpointBadge } from 'components';

const linkStyle = ({ theme }) => {
  return {
    color: theme.palette.primary.main,
    display: 'flex',
    fontSize: '2rem',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
    textDecoration: 'none',
    '& p': {
      paddingLeft: theme.spacing(1),
    },
  };
};
const StyledExternalLink = styled('a')(linkStyle);
const StyledRouterLink = styled(Link)(linkStyle);
const StyledListItem = styled(ListItem)(({ theme }) => {
  return {
    '&:hover': { backgroundColor: theme.palette.secondary.main },
  };
});

export function SideDrawer() {
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <Drawer
        PaperProps={{ sx: { paddingTop: '1rem', width: '12rem' } }}
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List>
          <Divider />
          <StyledListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <StyledRouterLink to="/home">
                <HomeIcon />
                <Typography>Home</Typography>
              </StyledRouterLink>
            </ListItemText>
          </StyledListItem>
          <Divider />
          <StyledListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <StyledRouterLink to="/settings">
                <SettingsIcon />
                <Typography>Settings</Typography>
              </StyledRouterLink>
            </ListItemText>
          </StyledListItem>
          <Divider />
          <StyledListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <TouchpointBadge
                anchor={{ vertical: 'bottom', horizontal: 'right' }}
                sxStyle={{ bottom: '-20%', fontSize: '10px', height: '0.825rem', right: '20%', width: '7.75rem' }}
              >
                <StyledExternalLink href={`${window.location.origin}/api/auth/logout`}>
                  <LogoutIcon />
                  <Typography>Logout</Typography>
                </StyledExternalLink>
              </TouchpointBadge>
            </ListItemText>
          </StyledListItem>
          <Divider />
        </List>
      </Drawer>
      <IconButton sx={{ color: theme.palette.primary.contrastText }} onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon />
      </IconButton>
    </>
  );
}
