import { Alert, Snackbar } from '@mui/material';
import { closeSnackBar } from 'app/snackBarSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function SnackBar() {
  const snackBar = useSelector(state => state.snackBar);
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(closeSnackBar());
  };
  return (
    <Snackbar
      open={snackBar.open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        variant="filled"
        severity={snackBar.type}
        sx={{ width: '100%' }}
      >
        {snackBar.message}
      </Alert>
    </Snackbar>
  );
}
