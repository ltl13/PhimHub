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
import AutocompleteField from 'custom-fields/AutocompleteField';
import InputField from 'custom-fields/InputField';
import { createRoom } from 'features/Room/slice';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { updateRoomById } from './../../slice';

const getErrorMessage = type => {
  switch (type) {
    case 'name':
      return 'Loại phòng đã tồn tại';
    case 'color':
      return 'Màu đã được dùng';
    default:
      return 'Lỗi server';
  }
};

function AddEditRoom(props) {
  const dispatch = useDispatch();
  const { onClose, open, room, setRows } = props;
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [colorRandomButton, setColorRandomButton] = useState('');
  const roomTypes = useSelector(state => state.roomTypes.current);

  const schema = yup.object().shape({
    name: yup.string().required('Tên phòng chiếu không được để trống'),
    roomType: yup
      .object()
      .required('Loại phòng chiếu không được để trống')
      .nullable(),
  });

  const emptyInitialValue = {
    name: '',
    roomType: null,
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
    if (room) {
      reset({
        name: room.name,
        roomType: { id: room.roomType._id, label: room.roomType.typeName },
      });
    }
  }, [room]);

  const { isSubmitting } = form.formState;

  const handleSubmit = async data => {
    dispatch(openBackdrop());
    setIsSubmitSuccess(false);

    if (!room) {
      const actions = createRoom({ ...data, roomType: data.roomType.id });
      const response = await dispatch(actions);
      if (response.payload.success) {
        setIsSubmitSuccess(true);

        setRows(prev => [
          ...prev,
          {
            id: response.payload.newRoom._id,
            roomType: { _id: data.roomType, typeName: data.roomType.label },
            name: response.payload.newRoom.name,
          },
        ]);
      } else {
        setError('room', {
          type: 'manual',
          message:
            !!response.payload.invalid &&
            getErrorMessage(response.payload.invalid),
        });
      }
    } else {
      const actions = updateRoomById({
        data: { ...data, roomType: data.roomType.id },
        id: room.id,
      });
      const response = await dispatch(actions);
      if (response.payload.success) {
        setIsSubmitSuccess(true);

        setRows(prev => [
          ...prev,
          {
            id: room.id,
            roomType: { _id: data.roomType, typeName: data.roomType.label },
            name: data.name,
          },
        ]);
      } else {
        setError('room', {
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
              <Typography variant="h4">Thông tin phòng chiếu</Typography>
              <IconButton onClick={handleClose} sx={{ height: '40px' }}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <InputField name="name" label="Tên phòng chiếu" form={form} />
          </Grid>

          <Grid item xs={12}>
            <AutocompleteField
              name="roomType"
              label="Loại phòng chiếu"
              form={form}
              options={roomTypes?.map(item => ({
                id: item._id,
                label: item.typeName,
              }))}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItem: 'center',
              }}
            >
              {!errors.room && !isSubmitSuccess && (
                <Box width="1px" height="1px" />
              )}
              {!!errors.room && (
                <FormHelperText error={errors.room}>
                  {errors.room.message}
                </FormHelperText>
              )}
              {!!isSubmitSuccess && (
                <FormHelperText sx={{ color: 'text.success' }}>
                  {!!room ? 'Sửa thành công' : 'Thêm thành công'}
                </FormHelperText>
              )}
              {!!room ? (
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

export default AddEditRoom;
