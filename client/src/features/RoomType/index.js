import {
  Box,
  Stack,
  Typography,
  Divider,
  Paper,
  Tooltip,
  IconButton,
  Button,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
} from '@mui/material';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import SeatTypeList from 'features/RoomType/components/SeatList';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllRoomType } from './slice';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import { getAllSeatType } from 'features/RoomType/seatTypeSlice';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import AddEditSeatType from './pages/AddEditSeatType/index';
import AddEditRoomType from './pages/AddEditRoomType';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

export default function RoomType() {
  const dispatch = useDispatch();
  const [roomTypes, setRoomTypes] = useState([]);
  const [seatType, setSeatType] = useState([]);
  const [openAddEditSeatType, setOpenAddEditSeatType] = useState(false);
  const [openAddEditRoomType, setOpenAddEditRoomType] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const load = async () => {
      dispatch(openBackdrop());

      const responseSeatType = await dispatch(getAllSeatType());
      if (responseSeatType.payload.success) {
        setSeatType(responseSeatType.payload.allSeatTypes);
      }

      const responseRoomType = await dispatch(getAllRoomType());
      if (responseRoomType.payload.success) {
        setRoomTypes(responseRoomType.payload.allRoomTypes);
      }
      dispatch(closeBackdrop());
    };
    load();
  }, []);

  const handleOpenAddEditSeatType = () => {
    setOpenAddEditSeatType(true);
  };

  const handleCloseAddEditSeatType = () => {
    setOpenAddEditSeatType(false);
  };

  const handleOpenAddEditRoomType = () => {
    setOpenAddEditRoomType(true);
  };

  const handleCloseAddEditRoomType = () => {
    setOpenAddEditRoomType(false);
    setSelectedRoomType(null);
  };

  const handleCloseMenuAction = () => {
    setAnchorEl(null);
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
            Loại Phòng Chiếu
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
              onClick={handleOpenAddEditRoomType}
              color="secondary"
            >
              Thêm Loại Phòng Chiếu
            </Button>
          </Stack>
        </Stack>
        <Stack
          // direction="co"
          alignItems="center"
          justifyContent="center"
          mb={5}
        >
          <Box sx={{ width: 'calc(100% - 220px)', mr: '220px' }}>
            {roomTypes.length === 0 && (
              <Typography variant="body1" width="100%" align="center">
                Chưa có loại phòng
              </Typography>
            )}
            {roomTypes.map(item => (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="body1">{item.typeName}</Typography>
                  <IconButton
                    onClick={event => {
                      setAnchorEl(event.currentTarget);
                      setSelectedRoomType(item);
                    }}
                  >
                    <MoreVertRoundedIcon fontSize="large" />
                  </IconButton>
                </Box>
                <SeatTypeList
                  seatType={seatType}
                  seats={item.seats}
                  preview={true}
                />
                <Divider />
              </>
            ))}
          </Box>
        </Stack>
        <Box
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            width: '200px',
            right: '20px',
            top: 'calc(100% / 2)',
            flexWrap: 'wrap',
            position: 'fixed',
          }}
        >
          <Paper sx={{ width: '100%' }}>
            <Box
              sx={{
                m: 1,
                mb: 2,
                alignItems: 'center',
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h4">Loại ghế</Typography>
              <Tooltip title="Thêm loại ghế" placement="top-end">
                <IconButton
                  onClick={() => {
                    handleOpenAddEditSeatType();
                  }}
                  mr={2}
                >
                  <AddRoundedIcon fontSize="large" color="success" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box m={1}>
              {seatType.map(
                item =>
                  item.typeName !== '#' && (
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                        mb: 1,
                      }}
                    >
                      <WeekendOutlinedIcon
                        fontSize="large"
                        sx={{ color: item.color, mr: 1 }}
                      />
                      <Typography variant="body1">{item.typeName}</Typography>
                    </Box>
                  ),
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
      <AddEditSeatType
        open={openAddEditSeatType}
        onClose={handleCloseAddEditSeatType}
        setSeatTypes={setSeatType}
      />
      <AddEditRoomType
        open={openAddEditRoomType}
        onClose={handleCloseAddEditRoomType}
        seatTypes={seatType}
        setRoomTypes={setRoomTypes}
        roomType={selectedRoomType}
      />

      {/* Menu actions */}
      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleCloseMenuAction}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={handleCloseMenuAction}
        >
          <ListItemIcon>
            <DeleteForeverRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Xóa"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>

        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            handleCloseMenuAction();
            handleOpenAddEditRoomType();
          }}
        >
          <ListItemIcon>
            <CreateRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Sửa thông tin"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
