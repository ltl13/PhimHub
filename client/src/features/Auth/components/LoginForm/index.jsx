import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
  Button,
  FormHelperText,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import InputField from 'custom-fields/InputField';
import PasswordField from 'custom-fields/PasswordField';
import { useNavigate } from 'react-router-dom';
import { login } from 'app/userSlice';
import { useDispatch } from 'react-redux';

LoginForm.propTypes = {};

function LoginForm(props) {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    username: yup.string().required('Tên đăng nhập không được để trống'),
    password: yup.string().required('Mật khẩu không được để trống'),
  });

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const {
    setError,
    formState: { errors },
  } = form;

  const { isSubmitting } = form.formState;

  const handleSubmit = async data => {
    const actions = login(data);
    const response = await dispatch(actions);
    if (response.payload.success) {
      navigate('/', { replace: true });
    } else {
      setError('login', {
        type: 'manual',
        message:
          response.payload.message === 'Incorrect username or password'
            ? 'Tên đăng nhập hoặc mật khẩu không đúng'
            : 'Lỗi server',
      });
    }
  };

  return (
    <div>
      {isSubmitting && <LinearProgress color="primary" />}
      <Typography variant="h2">Sign In</Typography>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack spacing={2.3}>
          <InputField
            name="username"
            label="Tên đăng nhập"
            form={form}
            inputRef={input => input && input.focus()}
          />
          <PasswordField name="password" label="Mật khẩu" form={form} />
          {!!errors.login && (
            <FormHelperText error={errors.login}>
              {errors.login.message}
            </FormHelperText>
          )}
          {!!errors.serverError && (
            <FormHelperText error={errors.serverError}>
              {errors.serverError.message}
            </FormHelperText>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            type="submit"
            disabled={isSubmitting}
            sx={{ height: '56px' }}
          >
            Đăng nhập
          </Button>
          {/* <LoadingButton
            loading
            loadingPosition="start"
            // startIcon={<SaveIcon />}
            variant="outlined"
          >
            Save
          </LoadingButton> */}
        </Stack>
      </form>
    </div>
  );
}

export default LoginForm;
