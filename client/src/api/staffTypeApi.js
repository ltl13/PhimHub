import axiosClient from './axiosClient';

const staffTypeApi = {
  getAllStaffType() {
    const url = '/staff-type/get-all';
    return axiosClient.get(url);
  },
  updateStaffTypeById(data, id) {
    const url = `/staff-type/update/${id}`;
    return axiosClient.put(url, data);
  },
  createStaffType(data) {
    const url = `/staff-type/create`;
    return axiosClient.post(url, data);
  },
};

export default staffTypeApi;
