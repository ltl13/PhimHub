import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import roomTypeApi from 'api/roomTypeApi';

export const getAllRoomType = createAsyncThunk('roomType/load', async () => {
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

export const updateRoomTypeById = createAsyncThunk(
  'roomType/updateRoomTypeById',
  async payload => {
    try {
      const response = await roomTypeApi.updateRoomTypeById(
        payload.data,
        payload.id,
      );
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const createRoomType = createAsyncThunk(
  'roomType/create',
  async (payload, { dispatch }) => {
    try {
      const response = await roomTypeApi.createRoomType(payload);
      // await dispatch(getAllRoomType());
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
    [getAllRoomType.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.allRoomTypes;
      }
    },
    [getAllRoomType.rejected]: (state, action) => {
      state.current = null;
    },
  },
});

const { reducer } = roomTypeSlice;
export default reducer;
