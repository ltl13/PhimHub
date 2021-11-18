import axiosClient from './axiosClient';

const userApi = {
  login(data) {
    const url = '/staff/login';
    return axiosClient.post(url, data);
  },
  loadUser() {
    const url = '/staff/';
    return axiosClient.get(url);
  },
};

export default userApi;
