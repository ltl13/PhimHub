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
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import AutocompleteField from 'custom-fields/AutocompleteField';
import DateField from 'custom-fields/DateField';
import ImageField from 'custom-fields/ImageField';
import InputField from 'custom-fields/InputField';
import {
  createMovie,
  getMovieById,
  updateMovieById,
} from 'features/Movie/slice';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import upload from 'utils/Firebase/upload';
import * as yup from 'yup';

const getErrorMessage = type => {
  switch (type) {
    case 'name':
      return 'Tên phim đã được sử dụng';
    default:
      return 'Lỗi server';
  }
};

const emptyInitialValue = {
  name: '',
  status: null,
  premiereDate: new Date(),
  movieTypes: [],
  duration: 0,
  verticalPoster: null,
  horizontalPoster: null,
  trailer: '',
  description: '',
};

function AddEditMovie(props) {
  const { onClose, open, setRows, movieId } = props;
  const dispatch = useDispatch();
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const movieTypes = useSelector(state => state.movieTypes.current);
  const [verticalPosterUrl, setVerticalPosterUrl] = useState('');
  const [horizontalPosterUrl, setHorizontalPosterUrl] = useState('');

  const listMovieTypes = movieTypes?.map(item => ({
    id: item._id,
    label: item.typeName,
  }));

  const schema = yup.object().shape({
    name: yup.string().required('Tên nhân viên không được để trống'),
    description: yup.string().required('Mô tả không được để trống'),
    status: yup.object().required('Trạng thái không được để trống').nullable(),
    // movieTypes: yup
    //   .object()
    //   .required('Thể loại không được để trống')
    //   .nullable(),
    duration: yup
      .number()
      .transform((value, originalValue) =>
        /\s/.test(originalValue) ? NaN : value,
      )
      .typeError('Thời lượng phải là số nguyên')
      .required('Thời lượng không được để trống')
      .min(0, 'Thời lượng phải lớn hơn 0'),
    premiereDate: yup
      .date()
      .nullable()
      .required('Ngày phát hành không được để trống'),
  });

  const form = useForm({
    defaultValues: emptyInitialValue,
    resolver: yupResolver(schema),
  });

  const {
    setError,
    formState: { errors, isDirty },
    clearErrors,
    reset,
  } = form;

  const { isSubmitting } = form.formState;

  useEffect(() => {
    async function load() {
      if (!!movieId) {
        const response = await dispatch(getMovieById({ id: movieId }));
        if (response.payload.success)
          reset({
            name: response.payload.movie.name,
            status: response.payload.movie.status
              ? { id: 1, label: 'Đang chiếu' }
              : { id: 0, label: 'Sắp chiếu' },
            premiereDate: response.payload.movie.premiereDate,
            duration: response.payload.movie.duration,
            description: response.payload.movie.description,
            trailer: response.payload.movie.trailer,
            movieTypes: response.payload.movie.movieTypes.map(item => ({
              id: item._id,
              label: item.typeName,
            })),
          });

        setVerticalPosterUrl(response.payload.movie.verticalPoster);
        setHorizontalPosterUrl(response.payload.movie.horizontalPoster);
      }
    }

    load();
  }, [open]);

  const handleSubmit = async data => {
    if (data.movieTypes.length === 0) {
      setError('movieTypes', {
        type: 'manual',
        message: 'Thể loại không được để trống',
      });

      return;
    }

    setIsSubmitSuccess(false);
    dispatch(openBackdrop());
    clearErrors();

    let url;
    const files = [];
    if (data.verticalPoster) {
      files.push(data.verticalPoster);
    }

    if (
      data.horizontalPoster &&
      data.horizontalPoster !== data.verticalPoster
    ) {
      files.push(data.horizontalPoster);
    }

    url = await upload(files);

    const reqBody = {
      ...data,
      verticalPoster: !!data.verticalPoster
        ? url[data.verticalPoster.name]
        : verticalPosterUrl,
      horizontalPoster: !!data.horizontalPoster
        ? url[data.horizontalPoster.name]
        : horizontalPosterUrl,
      movieTypes: data.movieTypes.map(type => type.id),
      status: !!data.status.id,
    };

    if (!movieId) {
      const actions = createMovie(reqBody);
      const response = await dispatch(actions);

      if (response.payload.success) {
        setIsSubmitSuccess(true);

        setRows(prev => {
          const tempRow = {};
          tempRow.id = response.payload.newMovie._id;
          tempRow.name = response.payload.newMovie.name;
          tempRow.premiereDate = response.payload.newMovie.premiereDate;
          tempRow.status = response.payload.newMovie.status;

          return [...prev, tempRow];
        });
      } else {
        setError('createMovie', {
          type: 'manual',
          message:
            !!response.payload.invalid &&
            getErrorMessage(response.payload.invalid),
        });
      }
    } else {
      const response = await dispatch(
        updateMovieById({ id: movieId, data: reqBody }),
      );
      if (response.payload.success) {
        setIsSubmitSuccess(true);

        setRows(prev => {
          const newRows = prev.filter(item => item.id !== movieId);

          const tempRow = {};
          tempRow.id = movieId;
          tempRow.name = reqBody.name;
          tempRow.premiereDate = reqBody.premiereDate;
          tempRow.status = reqBody.status;

          return [...newRows, tempRow];
        });
      } else {
        setError('createMovie', {
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
    <Dialog onClose={handleClose} open={open} maxWidth="md">
      {isSubmitting && <LinearProgress color="primary" />}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack direction="row" alignItems="center" m={2} spacing={2}>
          <Paper sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} p={3.5}>
              <Grid xs={12} mb={2}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItem: 'center',
                  }}
                >
                  <Typography variant="h4">Thông tin phim</Typography>
                  <IconButton onClick={handleClose}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <InputField name="name" label="Tên" form={form} />
              </Grid>

              <Grid item xs={6}>
                <DateField
                  name="premiereDate"
                  label="Ngày phát hành"
                  form={form}
                />
              </Grid>

              <Grid item xs={6}>
                <AutocompleteField
                  name="status"
                  label="Trạng thái"
                  form={form}
                  options={[
                    { id: 0, label: 'Sắp chiếu' },
                    { id: 1, label: 'Đang chiếu' },
                  ]}
                />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="duration"
                  label="Thời lượng"
                  form={form}
                  unit="phút"
                />
              </Grid>

              <Grid item xs={6}>
                <AutocompleteField
                  multiple={true}
                  name="movieTypes"
                  label="Thể loại"
                  form={form}
                  options={listMovieTypes}
                />
              </Grid>

              <Grid item xs={6}>
                <InputField name="trailer" label="Trailer" form={form} />
              </Grid>

              <Grid item xs={12}>
                <InputField
                  name="description"
                  label="Mô tả"
                  form={form}
                  multiline={true}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                >
                  <ImageField
                    name="verticalPoster"
                    form={form}
                    width={180}
                    height={270}
                    type="image"
                    label="Poster Dọc"
                    defaultValue={verticalPosterUrl}
                  />
                  <ImageField
                    name="horizontalPoster"
                    form={form}
                    width={328}
                    height={180}
                    type="image"
                    label="Poster ngang"
                    defaultValue={horizontalPosterUrl}
                  />
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
                  {!errors.createMovie && !isSubmitSuccess && (
                    <Box width="1px" height="1px" />
                  )}
                  {!!errors.createMovie && (
                    <FormHelperText error={errors.createMovie}>
                      {errors.createMovie.message}
                    </FormHelperText>
                  )}
                  {!!isSubmitSuccess && (
                    <FormHelperText sx={{ color: 'text.success' }}>
                      {!!movieId ? 'Sửa thành công' : 'Thêm thành công'}
                    </FormHelperText>
                  )}
                  {!!movieId ? (
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
                      Thêm Phim
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </form>
    </Dialog>
  );
}

export default AddEditMovie;
