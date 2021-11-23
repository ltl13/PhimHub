import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import { Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/system';
import { logout } from 'app/userSlice';
import AccountInfo from 'features/Dashboard/pages/AccountInfo';
import PasswordChange from 'features/Dashboard/pages/PasswordChange';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AccountStyle = styled(props => <Button {...props} />)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 3),
  textAlign: 'left',
  width: '100%',
}));

export default function AccountMenuButton() {
  const user = useSelector(state => state.user.current);
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [openAccountInfo, setOpenAccountInfo] = useState(false);

  const handleOpenAccountInfo = () => {
    setOpenAccountInfo(true);
  };

  const handleCloseAccountInfo = () => {
    setOpenAccountInfo(false);
  };

  const [openPasswordChange, setOpenPasswordChange] = useState(false);

  const handleOpenPasswordChange = () => {
    setOpenPasswordChange(true);
  };

  const handleClosePasswordChange = () => {
    setOpenPasswordChange(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
    const action = logout();
    await dispatch(action);

    navigate('/login', { replace: true });
  };
  return (
    !!user && (
      <>
        <Box>
          <AccountStyle onClick={handleClick}>
            <Avatar src={user.avatar} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user.staffType.typeName}
              </Typography>
            </Box>
          </AccountStyle>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              // mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 22,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleOpenAccountInfo}>
            <ListItemIcon>
              <PersonRoundedIcon fontSize="small" />
            </ListItemIcon>
            Thông tin
          </MenuItem>

          <MenuItem onClick={handleOpenPasswordChange}>
            <ListItemIcon>
              <VpnKeyRoundedIcon fontSize="small" />
            </ListItemIcon>
            Đổi mật khẩu
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogOut}>
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
        <AccountInfo open={openAccountInfo} onClose={handleCloseAccountInfo} />
        <PasswordChange
          open={openPasswordChange}
          onClose={handleClosePasswordChange}
        />
      </>
    )
  );
}
