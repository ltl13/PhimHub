import axiosClient from './axiosClient';

export const statisticApi = {
  getStatisticByMonthsInYears(data) {
    const url = '/statistic/by-months-in-year';
    return axiosClient.get(url, data);
  },

  getStatisticByYears(data) {
    const url = '/statistic/by-years';
    return axiosClient.get(url, data);
  },

  getStatisticByQuartersInYear(data) {
    const url = '/statistic/by-quarters-in-year';
    return axiosClient.get(url, data);
  },

  getStatisticByMoviesInMonth(data) {
    const url = '/statistic/by-movies-in-month';
    return axiosClient.get(url, data);
  },

  getStatisticByMoviesInDate(data) {
    const url = '/statistic/by-movies-in-date';
    return axiosClient.post(url, data);
  },
};
