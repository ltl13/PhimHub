import axiosClient from './axiosClient';

const roomTypeApi = {
  getAllRoomType() {
    const url = '/room-type/get-all';
    return axiosClient.get(url);
  },
  getRoomTypeById(id) {
    const url = `/room-type/get/${id}`;
    return axiosClient.get(url);
  },
  updateRoomTypeById(data, id) {
    const url = `/room-type/update/${id}`;
    return axiosClient.put(url, data);
  },
  createRoomType(data) {
    const url = `/room-type/create`;
    return axiosClient.post(url, data);
  },
};

export default roomTypeApi;
