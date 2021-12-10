import axiosClient from './axiosClient';

const seatTypeApi = {
  getAllSeatType() {
    const url = '/seat-type/get-all';
    return axiosClient.get(url);
  },
  getSeatTypeById(id) {
    const url = `/seat-type/get/${id}`;
    return axiosClient.get(url);
  },
  updateSeatTypeById(data, id) {
    const url = `/seat-type/update/${id}`;
    return axiosClient.put(url, data);
  },
  createSeatType(data) {
    const url = `/seat-type/create`;
    return axiosClient.post(url, data);
  },
};

export default seatTypeApi;
