import { yupResolver } from '@hookform/resolvers/yup';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import PasswordField from 'custom-fields/PasswordField';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

function PasswordChange(props) {
  const { onClose, open } = props;

  const schema = yup.object().shape({
    oldPass: yup.string().required('Mật khẩu cũ không được để trống'),
    newPass: yup.string().required('Mật khẩu mới không được để trống'),
  });
  const form = useForm({
    defaultValues: { oldPass: '', newPass: '' },
    resolver: yupResolver(schema),
  });

  const {
    setError,
    formState: { errors },
  } = form;

  const { isSubmitting } = form.formState;

  const handleSubmit = async data => {};

  return (
    <Dialog onClose={onClose} open={open}>
      {isSubmitting && <LinearProgress color="primary" />}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Grid container rowSpacing={2.5} p={3.5}>
          <Grid xs={12} mb={2}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItem: 'center',
              }}
            >
              <Typography variant="h3">Đổi mật khẩu</Typography>
              <IconButton onClick={onClose}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <PasswordField name="oldPass" label="Mật khẩu cũ" form={form} />
          </Grid>
          <Grid item xs={12}>
            <PasswordField name="newPass" label="Mật khẩu mới" form={form} />
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
