import axiosClient from './axiosClient';

const ticketTypeApi = {
  getAllTicketType() {
    const url = '/ticket-type/get-all';
    return axiosClient.get(url);
  },
  updateTicketTypeById(data, id) {
    const url = `/ticket-type/update/${id}`;
    return axiosClient.put(url, data);
  },
  createTicketType(data) {
    const url = `/ticket-type/create`;
    return axiosClient.post(url, data);
  },
};

export default ticketTypeApi;
