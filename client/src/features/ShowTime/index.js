import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Stack, Typography } from '@mui/material';
import DateField from 'custom-fields/DateField';
import TimeField from 'custom-fields/TimeField';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import 'react-horizontal-strip-datepicker/dist/ReactHorizontalDatePicker.css';
import ReactHorizontalDatePicker from 'react-horizontal-strip-datepicker';
import DatePicker from 'react-horizontal-datepicker';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { getAllMovieCalendars } from './slice';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';

function ShowTime(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      dispatch(openBackdrop());

      const action = getAllMovieCalendars();
      const response = await dispatch(action);

      if (response.payload.success) {
        // Create row table
        const tempRows = [];
        console.log(response.payload.allMovieCalendars);
        // setRows(tempRows);
      }
      // await dispatch(getAllMovieCalendarType());

      dispatch(closeBackdrop());
    };
    load();
  }, []);

  return (
    <>
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Lịch Chiếu
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Button
              variant="contained"
              mr={1}
              // onClick={handleOpenAddEditmovieCalendarType}
              color="secondary"
            >
              Thêm Lịch Chiếu
            </Button>
          </Stack>
        </Stack>
        <Stack alignItems="center" justifyContent="center" mb={5}>
          {/* <Box sx={{ width: 'calc(100% - 220px)', mr: '220px' }}>
            {movieCalendarTypes.length === 0 && (
              <Typography variant="body1" width="100%" align="center">
                Chưa có loại phòng
              </Typography>
            )}
            </Box> */}
        </Stack>
      </Box>
    </>
  );
}

export default ShowTime;
