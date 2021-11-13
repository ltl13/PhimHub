import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
  Stack,
  Avatar,
  Menu,
  Divider,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountMenuButton from 'components/AccountMenuButton';
import Sidebar from 'components/Sidebar';
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { AccountCircleRoundedIcon } from '@mui/icons-material/AccountCircleRounded';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

const drawerWidth = 260;

// const sidebarWidth = 260;

// function DashboardLayout(props) {
//   return (
//     // <Box sx={{ display: 'flex', width: '100%' }}>
//     //   <Sidebar />
//     //   <Outlet />
//     // </Box>
//     <>
//       <Box container sx={{ height: '100%', display: 'flex' }}>
//         <SimpleBar style={{ height: '100%', width: '260px' }}>
//           <Sidebar />
//         </SimpleBar>
//         <Outlet />
//       </Box>
//     </>
//   );
// }

// export default DashboardLayout;

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: 'white',
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

export default function DashboardLayout() {
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', overflow: 'hidden' }}>
      <CssBaseline />
      <AppBar position="absolute" open={open} elevation={0}>
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuRoundedIcon />
          </IconButton>
          {/* <Typography
            variant="h5"
            color="text.secondary"
            noWrap
            component="div"
          >
            Persistent drawer
          </Typography> */}
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <SimpleBar style={{ height: '100%' }}>
          <Stack spacing={3}>
            <DrawerHeader>
              <Typography variant="h5" color="text.secondary" ml={1}>
                PhimHub
              </Typography>
              <IconButton onClick={handleDrawerClose}>
                <ArrowBackIosNewRoundedIcon />
              </IconButton>
            </DrawerHeader>
            <AccountMenuButton />
            <Sidebar />
          </Stack>
        </SimpleBar>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}
