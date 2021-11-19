import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { alpha, styled, useTheme } from '@mui/system';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { matchPath, NavLink, useLocation } from 'react-router-dom';

const ListItemStyle = styled(props => (
  <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary,
  '&:before': {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: 'none',
    position: 'absolute',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

function NavItem({ item, active }) {
  const user = useSelector(state => state.user.current);
  const theme = useTheme();
  const isActiveRoot = active(item.path);
  const { title, path, icon, func, children } = item;
  const [open, setOpen] = useState(isActiveRoot);

  const activeRootStyle = {
    color: 'primary.main',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity,
    ),
    '&:before': { display: 'block' },
  };

  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium',
  };

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  const checkAccessFunc = (type, func = null) => {
    if (type === 1) {
      //Has children
      return (
        user &&
        children.some(item => user.staffType.funcs.indexOf(item.func.id) !== -1)
      );
    } else {
      //Hasn't children
      return user && func && user.staffType.funcs.indexOf(func.id) !== -1;
    }
  };

  if (children) {
    if (!checkAccessFunc(1)) return <></>;
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{ ...(isActiveRoot && activeRootStyle) }}
        >
          <ListItemIconStyle
            sx={{ ...(isActiveRoot && { color: 'primary.main' }) }}
          >
            {icon && icon}
          </ListItemIconStyle>
          <ListItemText disableTypography primary={title} />
          <Box
            sx={{
              width: 4,
              height: 4,
              ml: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {open ? (
              <KeyboardArrowDownRoundedIcon />
            ) : (
              <KeyboardArrowRightRoundedIcon />
            )}
          </Box>
        </ListItemStyle>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map(item => {
              const { title, path } = item;
              const isActiveSub = active(path);

              return (
                checkAccessFunc(0, item.func) && (
                  <ListItemStyle
                    key={title}
                    component={NavLink}
                    to={path}
                    sx={{ ...(isActiveSub && activeSubStyle) }}
                  >
                    <ListItemIconStyle>
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 4,
                          display: 'flex',
                          borderRadius: '50%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'text.disabled',
                          transition: theme =>
                            theme.transitions.create('transform'),
                          ...(isActiveSub && {
                            transform: 'scale(2)',
                            bgcolor: 'primary.main',
                          }),
                        }}
                      />
                    </ListItemIconStyle>
                    <ListItemText disableTypography primary={title} />
                  </ListItemStyle>
                )
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    checkAccessFunc(0, item.func) && (
      <ListItemStyle
        component={NavLink}
        to={path}
        sx={{ ...(isActiveRoot && activeRootStyle) }}
      >
        <ListItemIconStyle
          sx={{ ...(isActiveRoot && { color: 'primary.main' }) }}
        >
          {icon && icon}
        </ListItemIconStyle>
        <ListItemText disableTypography primary={title} />
      </ListItemStyle>
    )
  );
}

function NavSection({ navConfig, ...other }) {
  const { pathname } = useLocation();
  const match = path =>
    path ? !!matchPath({ path, end: false }, pathname) : false;

  return (
    <Box {...other}>
      <List disablePadding>
        {navConfig.map(item => (
          <NavItem key={item.title} item={item} active={match} />
        ))}
      </List>
    </Box>
  );
}

export default NavSection;
