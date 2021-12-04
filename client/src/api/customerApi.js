import axiosClient from './axiosClient';

const customerApi = {
  loadCustomers() {
    const url = '/customer/get-all';
    return axiosClient.get(url);
  },
  createCustomer(data) {
    const url = '/customer/create';
    return axiosClient.post(url, data);
  },
  deleteCustomer(id) {
    const url = `/customer/delete/${id}`;
    return axiosClient.delete(url);
  },
  getCustomerById(id) {
    const url = `/customer/get/${id}`;
    return axiosClient.get(url);
  },
  updateCustomerById(id, data) {
    const url = `/customer/update/${id}`;
    return axiosClient.put(url, data);
  },
};

export default customerApi;
