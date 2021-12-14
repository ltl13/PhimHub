import { yupResolver } from '@hookform/resolvers/yup';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import AutocompleteField from 'custom-fields/AutocompleteField';
import DateField from 'custom-fields/DateField';
import InputField from 'custom-fields/InputField';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import TimeField from 'custom-fields/TimeField';
import {
  createMovieCalendar,
  deleteMovieCalendar,
  updateMovieCalendarById,
} from '../slice';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import { openSnackBar } from 'app/snackBarSlice';

const getErrorMessage = type => {
  switch (type) {
    case 'time':
      return 'Giờ chiếu bị trùng';
    case 'hasCustomer':
      return 'Đã có khách đặt ghế';
    default:
      return 'Lỗi server';
  }
};

function AddEditShowTime(props) {
  const dispatch = useDispatch();
  const { onClose, open, movies, rooms, setCalendar, calendar } = props;
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const movieOption = movies?.map(movie => ({
    id: movie._id,
    label: movie.name,
  }));
  const roomOption = rooms?.map(room => ({ id: room._id, label: room.name }));

  const schema = yup.object().shape({
    movie: yup.object().required('Phòng chiếu không được để trống').nullable(),
    room: yup.object().required('Phim không được để trống').nullable(),
    price: yup
      .number()
      .transform((value, originalValue) =>
        /\s/.test(originalValue) ? NaN : value,
      )
      .typeError('Giá phải là số nguyên')
      .required('Giá không được để trống'),
    dateStart: yup
      .date()
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        'Ngày không được bé hơn hôm nay',
      )
      .required('Ngày chiếu không được để trống'),
    timeStart: yup
      .date()
      // .min(
      //   new Date(new Date() + yup.ref('dateStart') - new Date()),
      //   `Giờ phải lớn hơn ${new Date().getHours()}:${new Date().getMinutes()}`,
      // )
      .required('Giờ chiếu không được để trống'),
  });

  const emptyInitialValue = {
    timeStart: new Date(),
    dateStart: new Date(),
    price: 0,
    room: null,
    movie: null,
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

  useEffect(() => {
    console.log(calendar);
    if (calendar) {
      reset({
        dateStart: new Date(calendar.dateStart),
        timeStart: calendar.timeStart,
        price: calendar.price,
        movie: { id: calendar.movie._id, label: calendar.movie.name },
        room: { id: calendar.room._id, label: calendar.room.name },
      });
    }
  }, [calendar]);

  const handleSubmit = async data => {
    const date = new Date(data.dateStart).setHours(0, 0, 0, 0);
    const time = new Date(data.dateStart).setHours(
      data.timeStart.getHours(),
      data.timeStart.getMinutes(),
      0,
      0,
    );

    if (time - new Date() <= 0) {
      setError('timeStart', {
        type: 'manual',
        message: `Giờ phải lớn hơn ${new Date().getHours()}:${new Date().getMinutes()}`,
      });
      return;
    }

    const reqBody = {
      ...data,
      movie: data.movie.id,
      room: data.room.id,
      dateStart: date,
      timeStart: time,
    };

    if (!calendar) {
      const response = await dispatch(createMovieCalendar(reqBody));
      if (response.payload.success) {
        setIsSubmitSuccess(true);
        setCalendar(prev => {
          const movie = movies.find(m => m._id === data.movie.id);
          const room = rooms.find(m => m._id === data.room.id);
          prev.push({
            _id: response.payload.newMovieCalendar._id,
            ...data,
            timeStart: response.payload.newMovieCalendar.timeStart,
            dateStart: response.payload.newMovieCalendar.dateStart,
            movie,
            room,
          });

          return [...prev];
        });
      } else {
        setError('calendar', {
          type: 'manual',
          message:
            !!response.payload.invalid &&
            getErrorMessage(response.payload.invalid),
        });
      }
    } else {
      const response = await dispatch(
        updateMovieCalendarById({ data: reqBody, id: calendar._id }),
      );
      if (response.payload.success) {
        setIsSubmitSuccess(true);
        setCalendar(prev => {
          const movie = movies.find(m => m._id === data.movie.id);
          const room = rooms.find(m => m._id === data.room.id);

          return [
            ...prev.filter(item => item._id !== calendar._id),
            {
              _id: calendar._id,
              ...data,
              timeStart: data.timeStart.toISOString(),
              dateStart: data.dateStart.toISOString(),
              movie,
              room,
            },
          ];
        });
      } else {
        setError('calendar', {
          type: 'manual',
          message:
            !!response.payload.invalid &&
            getErrorMessage(response.payload.invalid),
        });
      }
    }
  };

  const handleClose = () => {
    onClose();
    reset(emptyInitialValue);
    clearErrors();
    setIsSubmitSuccess(false);
  };

  const handleDeleteCalendar = async () => {
    dispatch(openBackdrop());

    const response = await dispatch(deleteMovieCalendar({ id: calendar._id }));
    if (response.payload.success) {
      setCalendar(prev => [...prev.filter(item => calendar._id !== item._id)]);
      dispatch(openSnackBar({ type: 'success', message: 'Xóa thành công' }));
    } else {
      dispatch(
        openSnackBar({ type: 'error', message: 'Xóa không thành công' }),
      );
    }

    setOpenDeleteDialog(false);
    dispatch(closeBackdrop());
    handleClose();
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  return (
    <>
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
                <Typography variant="h4">Thông tin lịch chiếu</Typography>
                <IconButton onClick={handleClose} sx={{ height: '40px' }}>
                  <CloseRoundedIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <AutocompleteField
                name="movie"
                label="Phim"
                form={form}
                options={movieOption}
              />
            </Grid>

            <Grid item xs={12}>
              <AutocompleteField
                name="room"
                label="Phòng chiếu"
                form={form}
                options={roomOption}
              />
            </Grid>

            <Grid item xs={12}>
              <InputField name="price" label="Giá vé" form={form} />
            </Grid>

            <Grid item xs={12}>
              <DateField name="dateStart" label="Ngày chiếu" form={form} />
            </Grid>

            <Grid item xs={12}>
              <TimeField name="timeStart" label="Giờ chiếu" form={form} />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItem: 'center',
                }}
              >
                {!errors.calendar && !isSubmitSuccess && (
                  <Box width="1px" height="1px" />
                )}
                {!!errors.calendar && (
                  <FormHelperText error={errors.calendar}>
                    {errors.calendar.message}
                  </FormHelperText>
                )}
                {!!isSubmitSuccess && (
                  <FormHelperText sx={{ color: 'text.success' }}>
                    {!!calendar ? 'Sửa thành công' : 'Thêm thành công'}
                  </FormHelperText>
                )}
                {!!calendar ? (
                  <Box>
                    <Button
                      color="error"
                      sx={{ mr: 2 }}
                      onClick={handleOpenDeleteDialog}
                    >
                      Xóa
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={!isDirty}
                    >
                      Lưu chỉnh sửa
                    </Button>
                  </Box>
                ) : (
                  <Button variant="contained" color="secondary" type="submit">
                    Thêm lịch chiếu
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Dialog>
      {!!calendar && (
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Xác nhận xóa phim?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Bạn đang thực hiện xóa lịch chiếu phim ${calendar.movie.name} - ${calendar.room.name}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCalendar} color="error">
              Xóa Phim
            </Button>
            <Button onClick={handleCloseDeleteDialog} variant="none" autoFocus>
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default AddEditShowTime;
