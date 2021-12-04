import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import customerApi from 'api/customerApi';

export const loadCustomers = createAsyncThunk('customers/load', async () => {
  try {
    const response = await customerApi.loadCustomers();
    return response;
  } catch (error) {
    if (error.response) return error.response.data;
    else return { success: false, message: error.message };
  }
});

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (payload, { dispatch }) => {
    try {
      const response = await customerApi.createCustomer(payload);
      // await dispatch(loadCustomers());
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async payload => {
    try {
      const response = await customerApi.deleteCustomer(payload.id);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const getCustomerById = createAsyncThunk(
  'customers/getCustomerById',
  async payload => {
    try {
      const response = await customerApi.getCustomerById(payload.id);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const updateCustomerById = createAsyncThunk(
  'customers/updateCustomerById',
  async payload => {
    try {
      const response = await customerApi.updateCustomerById(
        payload.id,
        payload.data,
      );
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    current: null,
  },
  reducers: {},
  extraReducers: {
    [loadCustomers.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.allCustomers;
      }
    },
    [loadCustomers.rejected]: (state, action) => {
      state.current = null;
    },
  },
});

const { reducer } = customerSlice;
export default reducer;
