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
import AddEditCustomer from 'features/Customer/pages/AddEditCustomer';
import { deleteCustomer } from 'features/Customer/slice';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function CustomerMoreMenu(props) {
  const { setRows, customer } = props;
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddEditCustomer, setOpenAddEditCustomer] = useState(false);

  const handleDeleteCustomer = async () => {
    dispatch(openBackdrop());

    const response = await dispatch(deleteCustomer(customer));
    if (response.payload.success) {
      setRows(prev => prev.filter(item => customer.id !== item.id));
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

  const handleOpenAddEditCustomer = () => {
    setOpenAddEditCustomer(true);
  };

  const handleCloseAddEditCustomer = () => {
    setOpenAddEditCustomer(false);
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
            primary="Xóa Khách Hàng"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>

        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            handleOpenAddEditCustomer();
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
          {'Xác nhận xóa khách hàng?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Bạn đang thực hiện xóa khách hàng ${customer.name}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCustomer} color="error">
            Xóa khách hàng
          </Button>
          <Button onClick={handleCloseDeleteDialog} variant="none" autoFocus>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
      <AddEditCustomer
        onClose={handleCloseAddEditCustomer}
        open={openAddEditCustomer}
        setRows={setRows}
        customerId={customer.id}
      />
    </>
  );
}
