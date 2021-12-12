import { Box, Button, Stack, Typography } from '@mui/material';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import { getAllRoomType } from 'features/RoomType/slice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import RoomList from './components/RoomList';
import AddEditRoom from './pages/AddEditRoom';
import { getAllRooms } from './slice';

const headCells = [
  {
    id: 'name',
    align: 'left',
    label: 'Tên',
  },
  {
    id: 'type',
    align: 'left',
    label: 'Loại phòng',
  },
];

export default function Room() {
  const dispatch = useDispatch();
  const [openAddEditRoom, setOpenAddEditRoom] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      dispatch(openBackdrop());

      const action = getAllRooms();
      const response = await dispatch(action);

      if (response.payload.success) {
        // Create row table
        const tempRows = [];
        response.payload.allRooms.forEach(item => {
          const tempRow = {};
          tempRow.id = item._id;
          tempRow.name = item.name;
          tempRow.roomType = item.roomType;
          tempRows.push(tempRow);
        });
        setRows(tempRows);
      }
      await dispatch(getAllRoomType());

      dispatch(closeBackdrop());
    };
    load();
  }, []);

  const handleOpenAddEditRoom = () => {
    setOpenAddEditRoom(true);
  };

  const handleCloseAddEditRoom = () => {
    setOpenAddEditRoom(false);
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
            Phòng chiếu
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
              onClick={handleOpenAddEditRoom}
              color="secondary"
            >
              Thêm Phòng Chiếu
            </Button>
          </Stack>
        </Stack>
        <RoomList rows={rows} setRows={setRows} headCells={headCells} />
      </Box>
      <AddEditRoom
        onClose={handleCloseAddEditRoom}
        open={openAddEditRoom}
        setRows={setRows}
        roomId={null}
      />
    </>
  );
}
