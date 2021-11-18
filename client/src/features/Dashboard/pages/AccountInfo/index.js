import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Avatar,
  Box,
  Dialog,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

function AccountInfo(props) {
  const user = useSelector(state => state.user.current);
  const { onClose, open } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <Grid container spacing={2} p={3.5}>
        <Grid xs={12} mb={2}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItem: 'center',
            }}
          >
            <IconButton onClick={onClose}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </Grid>
        <Grid xs={12} pl={2} pb={4}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItem: 'center',
              width: '100%',
            }}
          >
            <Avatar
              src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              alt=""
              sx={{ width: 120, height: 120 }}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Họ và tên"
            value={!!user && user.name}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="CMND/CCCD"
            value={!!user && user.identityNumber}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Số điện thoại"
            value={!!user && user.phoneNumber}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Email"
            value={!!user && user.email}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Giới tính"
            value={!!user && user.sex ? 'Nam' : 'Nữ'}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Ngày sinh"
            value={new Date(!!user && user.dateOfBirth).toLocaleDateString()}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Chức vụ"
            value={!!user && user.staffType.typeName}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Lương"
            value={!!user && user.salary}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default AccountInfo;
