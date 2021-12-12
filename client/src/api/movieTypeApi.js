import axiosClient from './axiosClient';

const movieTypeApi = {
  getAllMovieType() {
    const url = '/movie-type/get-all';
    return axiosClient.get(url);
  },
  updateMovieTypeById(data, id) {
    const url = `/movie-type/update/${id}`;
    return axiosClient.put(url, data);
  },
  createMovieType(data) {
    const url = `/movie-type/create`;
    return axiosClient.post(url, data);
  },
};

export default movieTypeApi;
