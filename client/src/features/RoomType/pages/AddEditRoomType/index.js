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
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import InputField from 'custom-fields/InputField';
import SeatTypeList from 'features/RoomType/components/SeatList';
import { createRoomType, updateRoomTypeById } from 'features/RoomType/slice';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

const getErrorMessage = type => {
  switch (type) {
    case 'typeName':
      return 'Loại phòng đã tồn tại';
    case 'color':
      return 'Màu đã được dùng';
    default:
      return 'Lỗi server';
  }
};

function AddEditRoomType(props) {
  const dispatch = useDispatch();
  const { onClose, open, seatType, setRoomTypes, roomType } = props;
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [colorRandomButton, setColorRandomButton] = useState('');

  const schema = yup.object().shape({
    typeName: yup.string().required('Loại phòng không được để trống'),
  });

  const emptyInitialValue = {
    typeName: '',
    seats: [],
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

  useEffect(() => {
    if (roomType) {
      reset({
        typeName: roomType.typeName,
        seats: roomType.seats,
      });
    }
  }, [roomType]);

  const { isSubmitting } = form.formState;

  const handleSubmit = async data => {
    dispatch(openBackdrop());
    setIsSubmitSuccess(false);

    if (!roomType) {
      const actions = createRoomType(data);
      const response = await dispatch(actions);
      if (response.payload.success) {
        setIsSubmitSuccess(true);
        setRoomTypes(prev => [...prev, response.payload.newRoomType]);
      } else {
        setError('roomType', {
          type: 'manual',
          message:
            !!response.payload.invalid &&
            getErrorMessage(response.payload.invalid),
        });
      }
    } else {
      const actions = updateRoomTypeById({ id: roomType._id, data });
      const response = await dispatch(actions);
      if (response.payload.success) {
        setIsSubmitSuccess(true);
        setRoomTypes(prev => [
          ...prev.filter(x => x._id !== roomType._id),
          { id: roomType.id, typeName: data.typeName, seats: data.seats },
        ]);
      } else {
        setError('roomType', {
          type: 'manual',
          message:
            !!response.payload.invalid &&
            getErrorMessage(response.payload.invalid),
        });
      }
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
    <Dialog onClose={handleClose} open={open} maxWidth="xl">
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
              <Typography variant="h4">Thông tin loại phòng chiếu</Typography>
              <IconButton onClick={handleClose} sx={{ height: '40px' }}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={3}>
            <InputField name="typeName" label="Tên loại phòng" form={form} />
          </Grid>

          <Grid item xs={9}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItem: 'center',
              }}
            >
              {!errors.roomType && !isSubmitSuccess && (
                <Box width="1px" height="1px" />
              )}
              {!!errors.roomType && (
                <FormHelperText error={errors.roomType}>
                  {errors.roomType.message}
                </FormHelperText>
              )}
              {!!isSubmitSuccess && (
                <FormHelperText sx={{ color: 'text.success' }}>
                  {!!roomType ? 'Sửa thành công' : 'Thêm thành công'}
                </FormHelperText>
              )}
              {!!roomType ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ ml: 3 }}
                >
                  Lưu chỉnh sửa
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  sx={{ ml: 3 }}
                >
                  Thêm loại phòng
                </Button>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Controller
              control={form.control}
              name="seats"
              render={({ field: { onChange, value } }) => (
                <SeatTypeList
                  onChange={value => onChange(value)}
                  seats={!!roomType && roomType.seats}
                  seatType={props.seatTypes}
                />
              )}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <SeatTypeList
              onChange={value => setValue('seats', value)}
              seats={undefined}
              seatType={props.seatTypes}
              value={getValues('seats')}
            />
          </Grid> */}
        </Grid>
      </form>
    </Dialog>
  );
}

export default AddEditRoomType;
