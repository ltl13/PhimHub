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
    !!user && (
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
                src={user.avatar}
                alt=""
                sx={{ width: 120, height: 120 }}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Họ và tên"
              value={user.name}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CMND/CCCD"
              value={user.identityNumber}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Số điện thoại"
              value={user.phoneNumber}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              value={user.email}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Giới tính"
              value={user.sex ? 'Nam' : 'Nữ'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Ngày sinh"
              value={new Date(user.dateOfBirth).toLocaleDateString()}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Chức vụ"
              value={user.staffType.typeName}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Lương"
              value={user.salary}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </Dialog>
    )
  );
}

export default AccountInfo;
