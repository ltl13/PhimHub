import { Backdrop, CircularProgress } from '@mui/material';
import { SnackBar } from 'components/SnackBar';
import React from 'react';
import { useSelector } from 'react-redux';
import Router from 'routes';
import ThemeConfig from 'theme';
import GlobalStyles from 'theme/globalStyles';
import './App.css';

function App() {
  const backdrop = useSelector(state => state.backdrop);

  return (
    <ThemeConfig>
      <GlobalStyles />
      <Router />
      <SnackBar />
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 999 }}
        open={backdrop.open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeConfig>
  );
}

export default App;
