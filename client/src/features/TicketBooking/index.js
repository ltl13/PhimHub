import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import { getMoviesInShowing } from 'features/Movie/slice';
import { getAllRooms } from 'features/Room/slice';
import { getAllSeatType } from 'features/RoomType/seatTypeSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import 'simplebar/dist/simplebar.min.css';
import { getAllMovieCalendars } from './../ShowTime/slice';
import BookingForm from './pages/Booking/index';

const compareCalendar = (a, b) => {
  const dateA = new Date().setHours(
    new Date(a.timeStart).getHours(),
    new Date(a.timeStart).getMinutes(),
    0,
    0,
  );
  const dateB = new Date().setHours(
    new Date(b.timeStart).getHours(),
    new Date(b.timeStart).getMinutes(),
    0,
    0,
  );

  if (dateA < dateB) {
    return -1;
  }
  if (dateA > dateB) {
    return 1;
  }
  return 0;
};

function TicketBooking(props) {
  const dispatch = useDispatch();
  const [dateStart, setDateStart] = React.useState(
    new Date().setHours(0, 0, 0, 0),
  );
  const [allMovieCalendars, setAllMovieCalendars] = useState([]);
  const [calendarByMovie, setCalendarByMovie] = useState({});
  const [openBookingForm, setOpenBookingForm] = useState(false);
  const [selectedMovieCalendar, setSelectedMovieCalendar] = useState(null);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [seatType, setSeatType] = useState([]);

  useEffect(() => {
    const load = async () => {
      dispatch(openBackdrop());

      const action = getAllMovieCalendars();
      const responseCalendar = await dispatch(action);

      if (responseCalendar.payload.success) {
        setAllMovieCalendars(responseCalendar.payload.allMovieCalendars);
      }

      const responseMovies = await dispatch(getMoviesInShowing());

      if (responseMovies.payload.success) {
        setMovies(responseMovies.payload.allMovies);
      }

      const responseRooms = await dispatch(getAllRooms());

      if (responseRooms.payload.success) {
        setRooms(responseRooms.payload.allRooms);
      }

      const responseSeatTypes = await dispatch(getAllSeatType());

      if (responseSeatTypes.payload.success) {
        setSeatType(responseSeatTypes.payload.allSeatTypes);
      }

      dispatch(closeBackdrop());
    };
    load();
  }, []);

  useEffect(() => {
    const tempRows = {};

    allMovieCalendars.forEach(item => {
      const time = new Date().setHours(
        new Date(item.timeStart).getHours(),
        new Date(item.timeStart).getMinutes(),
        0,
        0,
      );
      if (dateStart - new Date(item.dateStart) === 0 && time - new Date() > 0)
        tempRows[item.movie._id] = !tempRows[item.movie._id]
          ? [item]
          : [...tempRows[item.movie._id], item];
    });
    Object.keys(tempRows).forEach(key => {
      tempRows[key] = tempRows[key].sort((a, b) => compareCalendar(a, b));
    });

    setCalendarByMovie(tempRows);
  }, [dateStart, allMovieCalendars]);

  const handleOpenBookingForm = () => {
    setOpenBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setOpenBookingForm(false);
    setSelectedMovieCalendar(null);
  };

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
            Đặt Vé
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Ngày đặt vé"
                value={dateStart}
                inputFormat="dd/MM/yyyy"
                onChange={newValue => {
                  const today = new Date().setHours(0, 0, 0, 0);
                  if (newValue.setHours(0, 0, 0, 0) - today > 0) {
                    setDateStart(newValue.setHours(0, 0, 0, 0));
                  } else {
                    setDateStart(today);
                  }
                }}
                renderInput={params => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Stack>
        </Stack>
        <Stack alignItems="center" justifyContent="center" mb={5}>
          <Box sx={{ width: '100%' }}>
            {Object.keys(calendarByMovie).length === 0 && (
              <Typography variant="body1" width="100%" align="center">
                Chưa có lịch chiếu
              </Typography>
            )}
            {Object.keys(calendarByMovie).map(key => (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Paper
                  elevation={3}
                  sx={{
                    width: '200px',
                    height: '330px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={calendarByMovie[key][0].movie.verticalPoster}
                    alt=""
                    style={{
                      width: '220px',
                      height: '330px',
                      objectFit: 'cover',
                    }}
                  />
                </Paper>
                <Box width="calc(100% - 220px)">
                  <div overflow="auto">
                    <Typography variant="h4" m={2} ml={3}>
                      {calendarByMovie[key][0].movie.name}
                    </Typography>
                  </div>
                  <Box sx={{ m: 2, ml: 3, minHeight: 'calc(330px - 68px)' }}>
                    {calendarByMovie[key].map(item => (
                      <Button
                        onClick={() => {
                          setSelectedMovieCalendar(item);
                          handleOpenBookingForm();
                        }}
                        variant="outlined"
                        sx={{ height: '80px', width: '100px', ml: 2 }}
                      >
                        {/* {calendarByMovie[key][0].room.name} */}
                        <Stack>
                          <Typography variant="h7">{item.room.name}</Typography>
                          <Divider />
                          <Typography variant="body1">
                            {`${new Date(
                              item.timeStart,
                            ).getHours()} : ${new Date(
                              item.timeStart,
                            ).getMinutes()}`}
                          </Typography>
                        </Stack>
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Stack>
      </Box>
      <BookingForm
        open={openBookingForm}
        onClose={handleCloseBookingForm}
        calendar={selectedMovieCalendar}
        movies={movies}
        rooms={rooms}
        seatTypes={seatType}
      />
    </>
  );
}

export default TicketBooking;
