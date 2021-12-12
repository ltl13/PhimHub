import axiosClient from './axiosClient';

const roomApi = {
  getAllRooms() {
    const url = '/room/get-all';
    return axiosClient.get(url);
  },
  createRoom(data) {
    const url = '/room/create';
    return axiosClient.post(url, data);
  },
  deleteRoom(id) {
    const url = `/room/delete/${id}`;
    return axiosClient.delete(url);
  },
  getRoomById(id) {
    const url = `/room/get/${id}`;
    return axiosClient.get(url);
  },
  updateRoomById(id, data) {
    const url = `/room/update/${id}`;
    return axiosClient.put(url, data);
  },
};

export default roomApi;
