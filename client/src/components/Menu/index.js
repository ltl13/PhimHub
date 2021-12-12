import Menu from '@mui/material/Menu';
import React from 'react';

function MenuWithArrow(props) {
  const { anchorEl, handleClose, children, ...other } = props;

  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={handleClose}
      onClick={handleClose}
      {...other}
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
      {children}
    </Menu>
  );
}

export default MenuWithArrow;
