import { CircularProgress, Divider, Grid, Typography } from '@mui/material';
import Sidebar from 'components/Sidebar';
import StorageKeys from 'constants/storage-keys';
import DashboardLayout from 'layout/DashboardLayout';
import React from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

const Login = React.lazy(() => import('features/Auth'));
const TicketFeature = React.lazy(() => import('features/Ticket'));

const Router = () => {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <Navigate to="/dashboard/booking" replace /> },
        {
          path: 'booking',
          element: (
            <PrivateRoute>
              <Typography variant="h1" color="text.secondary">
                Booking
              </Typography>
            </PrivateRoute>
          ),
        },
        {
          path: 'waiting-ticket',
          element: (
            <PrivateRoute>
              <Typography variant="h1" color="text.secondary">
                Waiting Ticket
              </Typography>
            </PrivateRoute>
          ),
        },
        {
          path: 'statistic',
          element: (
            <PrivateRoute>
              <Typography variant="h1" color="text.secondary">
                Statistic
              </Typography>
            </PrivateRoute>
          ),
        },
        {
          path: 'management',
          children: [
            {
              path: '',
              element: <Navigate to="/dashboard/management/movie" replace />,
            },
            {
              path: 'movie',
              element: (
                <PrivateRoute>
                  <Typography variant="h1" color="text.secondary">
                    Movie
                  </Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'staff',
              element: (
                <PrivateRoute>
                  <Typography variant="h1" color="text.secondary">
                    Staff
                  </Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'showtime',
              element: (
                <PrivateRoute>
                  <Typography variant="h1" color="text.secondary">
                    Showtime
                  </Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'cinema-room',
              element: (
                <PrivateRoute>
                  <Typography variant="h1" color="text.secondary">
                    Cinema room
                  </Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'customer',
              element: (
                <PrivateRoute>
                  <Typography variant="h1" color="text.secondary">
                    Customer
                  </Typography>
                </PrivateRoute>
              ),
            },
          ],
        },
        {
          path: 'setting',
          children: [
            {
              path: '',
              element: (
                <Navigate to="/dashboard/setting/authorization" replace />
              ),
            },
            {
              path: 'authorization',
              element: (
                <PrivateRoute>
                  <Typography variant="h1" color="text.secondary">
                    Authorization
                  </Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'discount',
              element: (
                <PrivateRoute>
                  <Typography variant="h1" color="text.secondary">
                    Discount
                  </Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'type-of-seat',
              element: (
                <PrivateRoute>
                  <Typography variant="h1" color="text.secondary">
                    Type of seat
                  </Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'type-of-payment',
              element: (
                <PrivateRoute>
                  <Typography variant="h1" color="text.secondary">
                    Type of payment
                  </Typography>
                </PrivateRoute>
              ),
            },
          ],
        },
      ],
    },
    {
      path: '/',
      children: [
        { path: '', element: <Navigate to="/dashboard" /> },
        {
          path: 'login',
          element: (
            <React.Suspense fallback={<Loading />}>
              <Login />
            </React.Suspense>
          ),
        },
        { path: '404', element: <Typography>Not Found</Typography> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
};

function Loading() {
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <CircularProgress />
    </Grid>
  );
}

function PrivateRoute({ children }) {
  const loginInUser = localStorage.getItem(StorageKeys.user);
  return !!loginInUser ? children : <Navigate to="/login" />;
}

export default Router;
