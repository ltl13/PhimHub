import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import staffApi from 'api/staffApi';

export const loadStaffs = createAsyncThunk('staffs/load', async () => {
  try {
    const response = await staffApi.loadStaffs();
    return response;
  } catch (error) {
    if (error.response) return error.response.data;
    else return { success: false, message: error.message };
  }
});

export const createStaff = createAsyncThunk(
  'staffs/create',
  async (payload, { dispatch }) => {
    try {
      const response = await staffApi.createStaff(payload);
      // await dispatch(loadStaffs());
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const deleteStaff = createAsyncThunk('staffs/delete', async payload => {
  try {
    const response = await staffApi.deleteStaff(payload.id);
    return response;
  } catch (error) {
    if (error.response) return error.response.data;
    else return { success: false, message: error.message, invalid: 'server' };
  }
});

export const getStaffById = createAsyncThunk(
  'staffs/getStaffById',
  async payload => {
    try {
      const response = await staffApi.getStaffById(payload.id);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const updateStaffById = createAsyncThunk(
  'staffs/updateStaffById',
  async payload => {
    try {
      const response = await staffApi.updateStaffById(payload.id, payload.data);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

const staffSlice = createSlice({
  name: 'staffs',
  initialState: {
    current: null,
  },
  reducers: {},
  extraReducers: {
    [loadStaffs.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.allStaffs;
      }
    },
    [loadStaffs.rejected]: (state, action) => {
      state.current = null;
    },
  },
});

const { reducer } = staffSlice;
export default reducer;
