import axiosClient from './axiosClient';

const movieApi = {
  loadMovies() {
    const url = '/movie/get-all';
    return axiosClient.get(url);
  },
  createMovie(data) {
    const url = '/movie/create';
    return axiosClient.post(url, data);
  },
  deleteMovie(id) {
    const url = `/movie/delete/${id}`;
    return axiosClient.delete(url);
  },
  getMovieById(id) {
    const url = `/movie/get/${id}`;
    return axiosClient.get(url);
  },
  getMovieInShowing() {
    const url = `/movie/get-in-showing`;
    return axiosClient.get(url);
  },
  updateMovieById(id, data) {
    const url = `/movie/update/${id}`;
    return axiosClient.put(url, data);
  },
};

export default movieApi;
