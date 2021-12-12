import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import roomApi from 'api/roomApi';

export const getAllRooms = createAsyncThunk('rooms/load', async () => {
  try {
    const response = await roomApi.getAllRooms();
    return response;
  } catch (error) {
    if (error.response) return error.response.data;
    else return { success: false, message: error.message };
  }
});

export const createRoom = createAsyncThunk(
  'rooms/create',
  async (payload, { dispatch }) => {
    try {
      const response = await roomApi.createRoom(payload);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const deleteRoom = createAsyncThunk('rooms/delete', async payload => {
  try {
    const response = await roomApi.deleteRoom(payload.id);
    return response;
  } catch (error) {
    if (error.response) return error.response.data;
    else return { success: false, message: error.message, invalid: 'server' };
  }
});

export const getRoomById = createAsyncThunk(
  'rooms/getRoomById',
  async payload => {
    try {
      const response = await roomApi.getRoomById(payload.id);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const updateRoomById = createAsyncThunk(
  'rooms/updateRoomById',
  async payload => {
    try {
      const response = await roomApi.updateRoomById(payload.id, payload.data);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

const roomSlice = createSlice({
  name: 'rooms',
  initialState: {
    current: null,
  },
  reducers: {},
  extraReducers: {
    [getAllRooms.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.allRooms;
      }
    },
    [getAllRooms.rejected]: (state, action) => {
      state.current = null;
    },
  },
});

const { reducer } = roomSlice;
export default reducer;
