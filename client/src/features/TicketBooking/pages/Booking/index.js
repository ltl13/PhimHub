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
import { createRoomType, updateRoomTypeById } from 'features/RoomType/slice';
import SeatList from 'features/TicketBooking/components/SeatList';
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

function BookingForm(props) {
  const dispatch = useDispatch();
  const { onClose, open, seatTypes, calendar, movies, rooms } = props;
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const schema = yup.object().shape({
    // typeName: yup.string().required('Loại phòng không được để trống'),
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

  const { isSubmitting } = form.formState;

  const handleSubmit = async data => {
    dispatch(openBackdrop());
    setIsSubmitSuccess(false);
    console.log(data);

    // if (!roomType) {
    //   const actions = createRoomType(data);
    //   const response = await dispatch(actions);
    //   if (response.payload.success) {
    //     setIsSubmitSuccess(true);
    //     setRoomTypes(prev => [...prev, response.payload.newRoomType]);
    //   } else {
    //     setError('roomType', {
    //       type: 'manual',
    //       message:
    //         !!response.payload.invalid &&
    //         getErrorMessage(response.payload.invalid),
    //     });
    //   }
    // } else {
    //   const actions = updateRoomTypeById({ id: roomType._id, data });
    //   const response = await dispatch(actions);
    //   if (response.payload.success) {
    //     setIsSubmitSuccess(true);
    //     setRoomTypes(prev => [
    //       ...prev.filter(x => x._id !== roomType._id),
    //       { _id: roomType._id, typeName: data.typeName, seats: data.seats },
    //     ]);
    //   } else {
    //     setError('roomType', {
    //       type: 'manual',
    //       message:
    //         !!response.payload.invalid &&
    //         getErrorMessage(response.payload.invalid),
    //     });
    //   }
    // }
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
              <Typography variant="h4">Chọn ghế và thanh toán</Typography>
              <IconButton onClick={handleClose} sx={{ height: '40px' }}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>
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
                  {'Đặt vé thành công'}
                </FormHelperText>
              )}
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                sx={{ ml: 3 }}
              >
                Đặt vé
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Controller
              control={form.control}
              name="seats"
              render={({ field: { onChange, value } }) => (
                <SeatList
                  onChange={value => onChange(value)}
                  seats={
                    rooms.find(item => item._id === calendar?.room._id)
                      ?.roomType.seats
                  }
                  calendar={calendar}
                  seatType={seatTypes}
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

export default BookingForm;
