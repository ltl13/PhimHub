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
import MenuWithArrow from 'components/Menu';
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
        <MenuWithArrow anchorEl={anchorEl} handleClose={handleClose}>
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
        </MenuWithArrow>
        <AccountInfo open={openAccountInfo} onClose={handleCloseAccountInfo} />
        <PasswordChange
          open={openPasswordChange}
          onClose={handleClosePasswordChange}
        />
      </>
    )
  );
}
