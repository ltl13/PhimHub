import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import { openSnackBar } from 'app/snackBarSlice';
import AddEditRoom from 'features/Room/pages/AddEditRoom';
import { deleteRoom } from 'features/Room/slice';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function RoomMoreMenu(props) {
  const { setRows, room } = props;
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddEditRoom, setOpenAddEditRoom] = useState(false);

  const handleDeleteRoom = async () => {
    dispatch(openBackdrop());

    const response = await dispatch(deleteRoom(room));
    if (response.payload.success) {
      setRows(prev => prev.filter(item => room.id !== item.id));
      dispatch(openSnackBar({ type: 'success', message: 'Xóa thành công' }));
    } else {
      dispatch(
        openSnackBar({ type: 'error', message: 'Xóa không thành công' }),
      );
    }

    setOpenDeleteDialog(false);
    dispatch(closeBackdrop());
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenAddEditRoom = () => {
    setOpenAddEditRoom(true);
  };

  const handleCloseAddEditRoom = () => {
    setOpenAddEditRoom(false);
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <MoreVertRoundedIcon />
      </IconButton>
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            handleOpenDeleteDialog();
            setIsOpen(false);
          }}
        >
          <ListItemIcon>
            <DeleteForeverRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Xóa phòng chiếu"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>

        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            handleOpenAddEditRoom();
            setIsOpen(false);
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
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Xác nhận xóa phòng chiếu?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Bạn đang thực hiện xóa ${room.name}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteRoom} color="error">
            Xóa Phòng
          </Button>
          <Button onClick={handleCloseDeleteDialog} variant="none" autoFocus>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
      <AddEditRoom
        onClose={handleCloseAddEditRoom}
        open={openAddEditRoom}
        setRows={setRows}
        room={room}
      />
    </>
  );
}
