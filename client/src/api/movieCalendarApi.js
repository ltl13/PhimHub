import axiosClient from './axiosClient';

const movieCalendarApi = {
  getAllMovieCalendars() {
    const url = '/movie-calendar/get-all';
    return axiosClient.get(url);
  },
  createMovieCalendar(data) {
    const url = '/movie-calendar/create';
    return axiosClient.post(url, data);
  },
  deleteMovieCalendar(id) {
    const url = `/movie-calendar/delete/${id}`;
    return axiosClient.delete(url);
  },
  getMovieCalendarById(id) {
    const url = `/movie-calendar/get/${id}`;
    return axiosClient.get(url);
  },
  updateMovieCalendarById(id, data) {
    const url = `/movie-calendar/update/${id}`;
    return axiosClient.put(url, data);
  },
};

export default movieCalendarApi;
