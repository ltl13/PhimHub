import { Typography } from '@mui/material';
import Loading from 'components/Loading';
import PrivateRoute from 'components/PrivateRoute';
import Function from 'constants/function';
import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

const Login = React.lazy(() => import('features/Auth'));
const DashboardLayout = React.lazy(() => import('features/Dashboard'));

const Router = () => {
  return useRoutes([
    {
      path: '/dashboard',
      element: (
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      ),
      children: [
        // { path: '', element: <Navigate to="/dashboard/booking" replace /> },
        {
          path: 'booking',
          element: (
            <PrivateRoute funcId={Function.TicketBooking.id}>
              <Typography variant="h3">Booking</Typography>
            </PrivateRoute>
          ),
        },
        {
          path: 'waiting-ticket',
          element: (
            <PrivateRoute funcId={Function.UnpaidTicket.id}>
              <Typography variant="h3">Waiting Ticket</Typography>
            </PrivateRoute>
          ),
        },
        {
          path: 'statistic',
          element: (
            <PrivateRoute funcId={Function.Statistic.id}>
              <Typography variant="h3">Statistic</Typography>
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
                <PrivateRoute funcId={Function.MovieManagement.id}>
                  <Typography variant="h3">Movie</Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'staff',
              element: (
                <PrivateRoute funcId={Function.StaffManagement.id}>
                  <Typography variant="h3">Staff</Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'showtime',
              element: (
                <PrivateRoute funcId={Function.ShowtimeManagement.id}>
                  <Typography variant="h3">Showtime</Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'cinema-room',
              element: (
                <PrivateRoute funcId={Function.CinemaRoomManagement.id}>
                  <Typography variant="h3">Cinema room</Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'customer',
              element: (
                <PrivateRoute funcId={Function.CustomerManagement.id}>
                  <Typography variant="h3">Customer</Typography>
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
                <PrivateRoute funcId={Function.AuthorizationSetting.id}>
                  <Typography variant="h3">Authorization</Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'promotion',
              element: (
                <PrivateRoute funcId={Function.PromotionSetting.id}>
                  <Typography variant="h3">Promotion</Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'type-of-seat',
              element: (
                <PrivateRoute funcId={Function.TypeOfSeatSetting.id}>
                  <Typography variant="h3">Type of seat</Typography>
                </PrivateRoute>
              ),
            },
            {
              path: 'type-of-payment',
              element: (
                <PrivateRoute funcId={Function.TypeOfPaymentSetting.id}>
                  <Typography variant="h3">Type of payment</Typography>
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
        {
          path: '500',
          element: <Typography>Internal server error</Typography>,
        },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
};

// function PrivateRoute({ children, funcId }) {
//   const user = useSelector(state => state.user.current);
//   const [token, setToken] = useState(localStorage[StorageKeys.access]);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const load = async () => {
//       const action = loadUser();
//       await dispatch(action);
//       setToken(localStorage[StorageKeys.access]);
//     };

//     if (token) load();

//     window.addEventListener('storage', load);
//     return () => {
//       window.removeEventListener('storage', load);
//     };
//   }, [localStorage[StorageKeys.access]]);

//   return !token ? (
//     <Navigate to="/login" />
//   ) : !!(user && funcId && user.staffType.funcs.indexOf(funcId) === -1) ? (
//     <Navigate to="/" />
//   ) : (
//     <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
//   );
// }

export default Router;
