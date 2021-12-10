import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import roomTypeApi from 'api/roomTypeApi';

export const loadRoomType = createAsyncThunk('roomType/load', async () => {
  try {
    const response = await roomTypeApi.getAllRoomType();
    return response;
  } catch (error) {
    if (error.response) return error.response.data;
    else return { success: false, message: error.message };
  }
});

export const getRoomTypeById = createAsyncThunk(
  'roomType/getRoomTypeById',
  async payload => {
    try {
      const response = await roomTypeApi.getRoomTypeById(payload.id);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  },
);

export const createRoomType = createAsyncThunk(
  'roomType/create',
  async (payload, { dispatch }) => {
    try {
      const response = await roomTypeApi.createRoomType(payload);
      await dispatch(loadRoomType());
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  },
);

const roomTypeSlice = createSlice({
  name: 'roomTypes',
  initialState: {
    current: null,
  },
  reducers: {},
  extraReducers: {
    [loadRoomType.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.allRoomTypes;
      }
    },
    [loadRoomType.rejected]: (state, action) => {
      state.current = null;
    },
  },
});

const { reducer } = roomTypeSlice;
export default reducer;
