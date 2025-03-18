import React, { forwardRef } from 'react';
import { AppBar, Dialog, DialogContent, Grid, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { CreateInvoiceForm } from 'components';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function CreateInvoiceDialog({ handleClose, open }) {
  return (
    <Dialog fullScreen={true} open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            New Invoice
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container maxWidth={1200} marginX="auto">
        <Grid container item xs={12} marginY="2rem">
          <Grid item xs={1} sm={2} />
          <Grid item xs={10} sm={8}>
            <DialogContent>
              <CreateInvoiceForm closeFormDialog={handleClose} />
            </DialogContent>
          </Grid>
          <Grid item xs={1} sm={2} />
        </Grid>
      </Grid>
    </Dialog>
  );
}
