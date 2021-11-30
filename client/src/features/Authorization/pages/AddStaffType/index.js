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
import InputField from 'custom-fields/InputField';
import { createStaffType } from 'features/Authorization/slice';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

function AddStaffType(props) {
  const dispatch = useDispatch();
  const { onClose, open, isSubmitSuccess, setIsSubmitSuccess } = props;

  const schema = yup.object().shape({
    typeName: yup.string().required('Loại nhân viên không được để trống'),
  });
  const form = useForm({
    defaultValues: { typeName: '' },
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
    setValue('typeName', '');
    clearErrors();
    onClose();
  };

  const handleSubmit = async data => {
    setIsSubmitSuccess(false);
    const actions = createStaffType(data);
    const response = await dispatch(actions);
    if (response.payload.success) {
      setIsSubmitSuccess(true);
    } else {
      setError('changePass', {
        type: 'manual',
        message: 'This type name has existed'
          ? 'Loại nhân viên đã tồn tại'
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
              <Typography variant="h3">Thêm loại nhân viên</Typography>
              <IconButton onClick={onDialogClose} sx={{ height: '40px' }}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <InputField name="typeName" label="Loại nhân viên" form={form} />
          </Grid>
          {!!errors.changePass && (
            <FormHelperText error={errors.changePass}>
              {errors.changePass.message}
            </FormHelperText>
          )}
          {!!isSubmitSuccess && (
            <FormHelperText sx={{ color: 'text.success' }}>
              Thêm thành công
            </FormHelperText>
          )}
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
              Thêm Loại Nhân Viên
            </Button>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
}

export default AddStaffType;
