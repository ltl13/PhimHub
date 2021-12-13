import axiosClient from './axiosClient';

const reportApi = {
  getReportByMonthsInYears(data) {
    const url = '/statistic/by-months-in-year';
    return axiosClient.get(url, data);
  },

  getReportByYears(data) {
    const url = '/statistic/by-years';
    return axiosClient.get(url, data);
  },

  getReportByQuartersInYear(data) {
    const url = '/statistic/by-quarters-in-year';
    return axiosClient.get(url, data);
  },

  getReportByMoviesInMonth(data) {
    const url = '/statistic/by-movies-in-month';
    return axiosClient.get(url, data);
  },

  getReportByMoviesInDate(data) {
    const url = '/report/by-movies-in-date';
    return axiosClient.get(url, data);
  },
};
