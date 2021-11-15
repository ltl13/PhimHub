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

LoginForm.propTypes = {};

function LoginForm(props) {
  let navigate = useNavigate();
  const { onSubmit } = props;

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

  const handleSubmit = async data => {
    if (onSubmit) {
      const response = await onSubmit(data);
      if (response.status === 200) {
        navigate('/', { replace: true });
      } else if (response.status === 401) {
        setError('login', {
          type: 'manual',
          message: 'Tên đăng nhập hoặc mật khẩu không đúng',
        });
      } else {
        navigate('/500', { replace: true });
      }
    }
  };

  const { isSubmitting } = form.formState;

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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            type="submit"
            disable={isSubmitting}
            sx={{ height: '56px' }}
          >
            Đăng nhập
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default LoginForm;
