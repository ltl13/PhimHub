import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import AddToPhotosRoundedIcon from '@mui/icons-material/AddToPhotosRounded';
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import SettingsApplicationsRoundedIcon from '@mui/icons-material/SettingsApplicationsRounded';

const sidebarConfig = [
  {
    title: 'Đặt vé',
    path: '/dashboard/booking',
    icon: <AddToPhotosRoundedIcon />,
  },
  {
    title: 'Vé đợi',
    path: '/dashboard/waiting-ticket',
    icon: <ConfirmationNumberRoundedIcon />,
  },
  {
    title: 'Thống kê',
    path: '/dashboard/statistic',
    icon: <InsertChartRoundedIcon />,
  },
  {
    title: 'Quản lý',
    path: '/dashboard/management',
    icon: <ManageAccountsRoundedIcon />,
    children: [
      {
        title: 'Phim',
        path: '/dashboard/management/movie',
      },
      {
        title: 'Nhân viên',
        path: '/dashboard/management/staff',
      },
      {
        title: 'Lịch chiếu',
        path: '/dashboard/management/showtime',
      },
      {
        title: 'Phòng chiếu',
        path: '/dashboard/management/cinema-room',
      },
      {
        title: 'Khách hàng',
        path: '/dashboard/management/customer',
      },
    ],
  },
  {
    title: 'Cài đặt',
    path: '/dashboard/setting',
    icon: <SettingsApplicationsRoundedIcon />,
    children: [
      {
        title: 'Phân quyền',
        path: '/dashboard/setting/authorization',
      },
      {
        title: 'Khuyến mãi',
        path: '/dashboard/setting/promotion',
      },
      {
        title: 'Loại ghế',
        path: '/dashboard/setting/type-of-seat',
      },
      {
        title: 'Thanh toán',
        path: '/dashboard/setting/type-of-payment',
      },
    ],
  },
];

export default sidebarConfig;
