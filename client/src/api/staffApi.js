import axiosClient from './axiosClient';

const staffApi = {
  loadStaffs() {
    const url = '/staff/get-all';
    return axiosClient.get(url);
  },
  createStaff(data) {
    const url = '/staff/create';
    return axiosClient.post(url, data);
  },
};

export default staffApi;
