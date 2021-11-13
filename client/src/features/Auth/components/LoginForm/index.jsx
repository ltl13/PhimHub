import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button, LinearProgress, Stack, Typography } from '@mui/material';
import InputField from 'custom-fields/InputField';
import PasswordField from 'custom-fields/PasswordField';

LoginForm.propTypes = {};

function LoginForm(props) {
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

  const handleSubmit = async data => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div>
      {isSubmitting && <LinearProgress color="primary" />}
      <Typography variant="h2">Sign In</Typography>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack spacing={2.3}>
          <InputField name="username" label="Tên đăng nhập" form={form} />
          <PasswordField name="password" label="Mật khẩu" form={form} />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            type="submit"
            disable={isSubmitting}
          >
            Đăng nhập
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default LoginForm;
