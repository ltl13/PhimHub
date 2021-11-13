import { login } from 'app/userSlice';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

LoginPage.propTypes = {};

function LoginPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async data => {
    try {
      const actions = login(data);
      await dispatch(actions);
      navigate('/', { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleSubmit} />
    </div>
  );
}

export default LoginPage;
