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
  deleteStaff(id) {
    const url = `/staff/delete/${id}`;
    return axiosClient.delete(url);
  },
  getStaffById(id) {
    const url = `/staff/get/${id}`;
    return axiosClient.get(url);
  },
  updateStaffById(id, data) {
    const url = `/staff/update/${id}`;
    return axiosClient.put(url, data);
  },
};

export default staffApi;
