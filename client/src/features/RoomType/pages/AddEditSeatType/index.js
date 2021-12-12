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
import AutocompleteField from 'custom-fields/AutocompleteField';
import InputField from 'custom-fields/InputField';
import { createStaffType } from 'features/Authorization/slice';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import { createSeatType } from './../../seatTypeSlice';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';

const getErrorMessage = type => {
  switch (type) {
    case 'typeName':
      return 'Loại ghế đã tồn tại';
    case 'color':
      return 'Màu đã được dùng';
    default:
      return 'Lỗi server';
  }
};

function AddEditSeatType(props) {
  const dispatch = useDispatch();
  const { onClose, open, seatType, setSeatTypes } = props;
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [colorRandomButton, setColorRandomButton] = useState('');

  const schema = yup.object().shape({
    typeName: yup.string().required('Loại ghế không được để trống'),
    size: yup.object().required('Trạng thái không được để trống').nullable(),
    color: yup
      .string()
      .matches(/^#([0-9a-f]{3}){1,2}$/i, 'Mã màu không đúng chuẩn')
      .required('Màu ghế không được để trống'),
  });

  const emptyInitialValue = {
    typeName: '',
    size: null,
    color: '',
  };

  const form = useForm({
    defaultValues: emptyInitialValue,
    resolver: yupResolver(schema),
  });

  const {
    setError,
    formState: { errors, isDirty },
    clearErrors,
    reset,
    setValue,
    getValues,
  } = form;

  const { isSubmitting } = form.formState;

  const handleSubmit = async data => {
    dispatch(openBackdrop());
    setIsSubmitSuccess(false);

    const actions = createSeatType({ ...data, size: data.size.id });
    const response = await dispatch(actions);
    if (response.payload.success) {
      setIsSubmitSuccess(true);

      setSeatTypes(prev => [...prev, response.payload.newSeatType]);
    } else {
      setError('seatType', {
        type: 'manual',
        message:
          !!response.payload.invalid &&
          getErrorMessage(response.payload.invalid),
      });
    }

    dispatch(closeBackdrop());
  };

  const handleClose = () => {
    onClose();
    reset(emptyInitialValue);
    clearErrors();
    setIsSubmitSuccess(false);
  };
  return (
    <Dialog onClose={handleClose} open={open}>
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
              <Typography variant="h4">Thông tin loại ghế</Typography>
              <IconButton onClick={handleClose} sx={{ height: '40px' }}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <InputField name="typeName" label="Tên loại ghế" form={form} />
          </Grid>

          <Grid item xs={12}>
            <AutocompleteField
              name="size"
              label="Số chổ"
              form={form}
              options={[
                { id: 0, label: '1' },
                { id: 1, label: '2' },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InputField name="color" label="Màu ghế" form={form} />

              <IconButton
                onClick={() => {
                  const color =
                    '#' + Math.floor(Math.random() * 16777215).toString(16);
                  setColorRandomButton(color);
                  setValue('color', color);
                }}
                sx={{
                  width: '51px',
                  height: '51px',
                  ml: 1,
                  color: colorRandomButton,
                }}
              >
                <ShuffleRoundedIcon fontSize="large" />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItem: 'center',
              }}
            >
              {!errors.seatType && !isSubmitSuccess && (
                <Box width="1px" height="1px" />
              )}
              {!!errors.seatType && (
                <FormHelperText error={errors.seatType}>
                  {errors.seatType.message}
                </FormHelperText>
              )}
              {!!isSubmitSuccess && (
                <FormHelperText sx={{ color: 'text.success' }}>
                  {!!seatType ? 'Sửa thành công' : 'Thêm thành công'}
                </FormHelperText>
              )}
              {!!seatType ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!isDirty}
                >
                  Lưu chỉnh sửa
                </Button>
              ) : (
                <Button variant="contained" color="secondary" type="submit">
                  Thêm loại ghế
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
}

export default AddEditSeatType;
