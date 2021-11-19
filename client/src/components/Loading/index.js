import { Grid, CircularProgress } from '@mui/material';
import React from 'react';

function Loading() {
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <CircularProgress />
    </Grid>
  );
}

export default Loading;
