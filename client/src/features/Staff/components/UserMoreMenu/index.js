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
import AddEditStaff from 'features/Staff/pages/AddEditStaff';
import { deleteStaff } from 'features/Staff/slice';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function UserMoreMenu(props) {
  const userLoggedIn = useSelector(state => state.user);
  const navigate = useNavigate();
  const { setRows, staff } = props;
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddEditStaff, setOpenAddEditStaff] = useState(false);

  const handleDeleteStaff = async () => {
    dispatch(openBackdrop());

    const response = await dispatch(deleteStaff(staff));
    if (response.payload.success) {
      setRows(prev => prev.filter(item => staff.id !== item.id));
      dispatch(openSnackBar({ type: 'success', message: 'Xóa thành công' }));
    } else {
      dispatch(
        openSnackBar({ type: 'error', message: 'Xóa không thành công' }),
      );
    }

    setOpenDeleteDialog(false);
    dispatch(closeBackdrop());

    if (staff.id === userLoggedIn.current._id) {
      navigate('/login', { replace: true });
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenAddEditStaff = () => {
    setOpenAddEditStaff(true);
  };

  const handleCloseAddEditStaff = () => {
    setOpenAddEditStaff(false);
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
            primary="Xóa nhân viên"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>

        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            handleOpenAddEditStaff();
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
          {'Xác nhận xóa nhân viên?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Bạn đang thực hiện xóa nhân viên ${staff.staffName} chức vụ ${staff.role}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteStaff} color="error">
            Xóa nhân viên
          </Button>
          <Button onClick={handleCloseDeleteDialog} variant="none" autoFocus>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
      <AddEditStaff
        onClose={handleCloseAddEditStaff}
        open={openAddEditStaff}
        setRows={setRows}
        staffId={staff.id}
      />
    </>
  );
}
