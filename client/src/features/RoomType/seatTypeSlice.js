import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import seatTypeApi from 'api/seatTypeApi';

export const getAllSeatType = createAsyncThunk(
  'seatType/getAllSeatType',
  async () => {
    try {
      const response = await seatTypeApi.getAllSeatType();
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  },
);

export const getSeatTypeById = createAsyncThunk(
  'seatType/getSeatTypeById',
  async payload => {
    try {
      const response = await seatTypeApi.getSeatTypeById(payload.id);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  },
);

export const createSeatType = createAsyncThunk(
  'seatType/create',
  async (payload, { dispatch }) => {
    try {
      const response = await seatTypeApi.createSeatType(payload);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  },
);

const seatTypeSlice = createSlice({
  name: 'seatTypes',
  initialState: {
    current: null,
  },
  reducers: {},
  extraReducers: {
    [getAllSeatType.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.allSeatTypes;
      }
    },
    [getAllSeatType.rejected]: (state, action) => {
      state.current = null;
    },
  },
});

const { reducer } = seatTypeSlice;
export default reducer;
