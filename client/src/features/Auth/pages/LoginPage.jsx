import { login } from 'app/userSlice';
import React from 'react';
import { useDispatch } from 'react-redux';
import LoginForm from '../components/LoginForm';

LoginPage.propTypes = {};

function LoginPage(props) {
  const dispatch = useDispatch();

  const handleSubmit = async data => {
    const actions = login(data);
    return (await dispatch(actions)).payload;
  };

  return (
    <div>
      <LoginForm onSubmit={handleSubmit} />
    </div>
  );
}

export default LoginPage;
