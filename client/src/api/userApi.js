import axiosClient from './axiosClient';

const userApi = {
  login(data) {
    const url = '/staff/login';
    return axiosClient.put(url, data);
  },
  loadUser() {
    const url = '/staff/';
    return axiosClient.get(url);
  },
  changePassword(data) {
    const url = '/staff/change-password';
    return axiosClient.put(url, data);
  },
};

export default userApi;
