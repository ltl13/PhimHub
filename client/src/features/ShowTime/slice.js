import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import movieCalendarApi from 'api/movieCalendarApi';

export const getAllMovieCalendars = createAsyncThunk(
  'movieCalendars/load',
  async () => {
    try {
      const response = await movieCalendarApi.getAllMovieCalendars();
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  },
);

export const createMovieCalendar = createAsyncThunk(
  'movieCalendars/create',
  async (payload, { dispatch }) => {
    try {
      const response = await movieCalendarApi.createMovieCalendar(payload);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const deleteMovieCalendar = createAsyncThunk(
  'movieCalendars/delete',
  async payload => {
    try {
      const response = await movieCalendarApi.deleteMovieCalendar(payload.id);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const getMovieCalendarById = createAsyncThunk(
  'movieCalendars/getMovieCalendarById',
  async payload => {
    try {
      const response = await movieCalendarApi.getMovieCalendarById(payload.id);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const updateMovieCalendarById = createAsyncThunk(
  'movieCalendars/updateMovieCalendarById',
  async payload => {
    try {
      const response = await movieCalendarApi.updateMovieCalendarById(
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

const movieCalendarSlice = createSlice({
  name: 'movieCalendars',
  initialState: {
    current: null,
  },
  reducers: {},
  extraReducers: {
    [getAllMovieCalendars.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.allMovieCalendars;
      }
    },
    [getAllMovieCalendars.rejected]: (state, action) => {
      state.current = null;
    },
  },
});

const { reducer } = movieCalendarSlice;
export default reducer;
