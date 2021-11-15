import axiosClient from './axiosClient';

const userApi = {
  login(data) {
    const url = '/auth/login';
    return axiosClient.post(url, data);
  },
  getAuthBy(id) {
    const url = `/auth/get/${id}`;
    return axiosClient.get(url);
  },
};

export default userApi;
