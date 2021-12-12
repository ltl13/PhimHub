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
import AddEditMovie from 'features/Movie/pages/AddEditMovie';
import { deleteMovie } from 'features/Movie/slice';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function MovieMoreMenu(props) {
  const { setRows, movie } = props;
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddEditMovie, setOpenAddEditMovie] = useState(false);

  const handleDeleteMovie = async () => {
    dispatch(openBackdrop());

    const response = await dispatch(deleteMovie(movie));
    if (response.payload.success) {
      setRows(prev => prev.filter(item => movie.id !== item.id));
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

  const handleOpenAddEditMovie = () => {
    setOpenAddEditMovie(true);
  };

  const handleCloseAddEditMovie = () => {
    setOpenAddEditMovie(false);
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
            primary="Xóa phim"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>

        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            handleOpenAddEditMovie();
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
          {'Xác nhận xóa phim?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Bạn đang thực hiện xóa phim ${movie.name}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteMovie} color="error">
            Xóa Phim
          </Button>
          <Button onClick={handleCloseDeleteDialog} variant="none" autoFocus>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
      <AddEditMovie
        onClose={handleCloseAddEditMovie}
        open={openAddEditMovie}
        setRows={setRows}
        movieId={movie.id}
      />
    </>
  );
}
