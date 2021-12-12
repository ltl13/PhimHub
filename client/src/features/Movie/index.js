import { Box, Button, Stack, Typography } from '@mui/material';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MovieList from './components/MovieList';
import { loadMovieType } from './movieTypeSlice';
import AddEditMovie from './pages/AddEditMovie';
import { loadMovies } from './slice';

const headCells = [
  {
    id: 'name',
    align: 'left',
    label: 'Tên',
  },
  {
    id: 'premiereDate',
    align: 'left',
    label: 'Ngày phát hành',
  },
  {
    id: 'status',
    align: 'left',
    label: 'Trạng thái',
  },
];

export default function Movie() {
  const dispatch = useDispatch();
  const [openAddEditMovie, setOpenAddEditMovie] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      dispatch(openBackdrop());

      const action = loadMovies();
      const response = await dispatch(action);

      if (response.payload.success) {
        // Create row table
        const tempRows = [];
        response.payload.allMovies.forEach(item => {
          const tempRow = {};
          tempRow.id = item._id;
          tempRow.name = item.name;
          tempRow.premiereDate = item.premiereDate;
          tempRow.status = item.status;
          tempRows.push(tempRow);
        });
        setRows(tempRows);
      }
      await dispatch(loadMovieType());

      dispatch(closeBackdrop());
    };
    load();
  }, []);

  const handleOpenAddEditMovie = () => {
    setOpenAddEditMovie(true);
  };

  const handleCloseAddEditMovie = () => {
    setOpenAddEditMovie(false);
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Phim
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
              onClick={handleOpenAddEditMovie}
              color="secondary"
            >
              Thêm Phim
            </Button>
          </Stack>
        </Stack>
        <MovieList rows={rows} setRows={setRows} headCells={headCells} />
      </Box>
      <AddEditMovie
        onClose={handleCloseAddEditMovie}
        open={openAddEditMovie}
        setRows={setRows}
        movieId={null}
      />
    </>
  );
}
