import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import AddToPhotosRoundedIcon from '@mui/icons-material/AddToPhotosRounded';
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import SettingsApplicationsRoundedIcon from '@mui/icons-material/SettingsApplicationsRounded';
import Function from 'constants/function';

const sidebarConfig = [
  {
    title: 'Đặt vé',
    path: '/dashboard/booking',
    func: Function.TicketBooking,
    icon: <AddToPhotosRoundedIcon />,
  },
  {
    title: 'Vé đợi',
    path: '/dashboard/waiting-ticket',
    func: Function.UnpaidTicket,
    icon: <ConfirmationNumberRoundedIcon />,
  },
  {
    title: 'Thống kê',
    path: '/dashboard/statistic',
    func: Function.Statistic,
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
        func: Function.MovieManagement,
      },
      {
        title: 'Nhân viên',
        path: '/dashboard/management/staff',
        func: Function.StaffManagement,
      },
      {
        title: 'Lịch chiếu',
        path: '/dashboard/management/showtime',
        func: Function.ShowtimeManagement,
      },
      {
        title: 'Phòng chiếu',
        path: '/dashboard/management/cinema-room',
        func: Function.CinemaRoomManagement,
      },
      {
        title: 'Khách hàng',
        path: '/dashboard/management/customer',
        func: Function.CustomerManagement,
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
        func: Function.AuthorizationSetting,
      },
      {
        title: 'Khuyến mãi',
        path: '/dashboard/setting/promotion',
        func: Function.PromotionSetting,
      },
      {
        title: 'Loại ghế',
        path: '/dashboard/setting/type-of-seat',
        func: Function.TypeOfSeatSetting,
      },
      {
        title: 'Thanh toán',
        path: '/dashboard/setting/type-of-payment',
        func: Function.TypeOfPaymentSetting,
      },
    ],
  },
];

export default sidebarConfig;
