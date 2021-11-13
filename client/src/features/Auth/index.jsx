import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

Login.propTypes = {};

function Login(props) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} exact />
      </Routes>
    </div>
  );
}

export default Login;
