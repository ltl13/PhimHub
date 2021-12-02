import { yupResolver } from '@hookform/resolvers/yup';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Box,
  Button,
  Dialog,
  FormHelperText,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { changePassword } from 'app/userSlice';
import PasswordField from 'custom-fields/PasswordField';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

function PasswordChange(props) {
  const dispatch = useDispatch();
  const [isSubmittingSuccess, setIsSubmittingSuccess] = useState(false);
  const { onClose, open } = props;

  const schema = yup.object().shape({
    oldPassword: yup.string().required('Mật khẩu cũ không được để trống'),
    newPassword: yup.string().required('Mật khẩu mới không được để trống'),
  });
  const form = useForm({
    defaultValues: { oldPassword: '', newPassword: '' },
    resolver: yupResolver(schema),
  });

  const {
    setError,
    formState: { errors },
    clearErrors,
    setValue,
  } = form;

  const { isSubmitting } = form.formState;

  const onDialogClose = () => {
    setIsSubmittingSuccess(false);
    setValue('oldPassword', '');
    setValue('newPassword', '');
    clearErrors();
    onClose();
  };

  const handleSubmit = async data => {
    setIsSubmittingSuccess(false);

    const actions = changePassword(data);
    const response = await dispatch(actions);

    if (response.payload.success) {
      setIsSubmittingSuccess(true);
    } else {
      setError('changePass', {
        type: 'manual',
        message:
          response.payload.message === 'Old password is not correct'
            ? 'Mật khẩu cũ không đúng'
            : 'Lối server',
      });
    }
  };

  return (
    <Dialog onClose={onDialogClose} open={open}>
      {isSubmitting && <LinearProgress color="primary" />}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Grid container rowSpacing={2.5} p={3.5}>
          <Grid xs={12} mb={1} mt={1}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItem: 'center',
              }}
            >
              <Typography variant="h3">Đổi mật khẩu</Typography>
              <IconButton onClick={onDialogClose} sx={{ height: '40px' }}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <PasswordField name="oldPassword" label="Mật khẩu cũ" form={form} />
          </Grid>
          <Grid item xs={12}>
            <PasswordField
              name="newPassword"
              label="Mật khẩu mới"
              form={form}
            />
          </Grid>
          <Grid item xs={12}>
            {!!errors.changePass && (
              <FormHelperText error={errors.changePass}>
                {errors.changePass.message}
              </FormHelperText>
            )}
            {!!isSubmittingSuccess && (
              <FormHelperText sx={{ color: 'text.success' }}>
                Đổi mật khẩu thành công
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              type="submit"
              disabled={isSubmitting}
              sx={{ height: '56px' }}
            >
              Đổi mật khẩu
            </Button>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
}

export default PasswordChange;
