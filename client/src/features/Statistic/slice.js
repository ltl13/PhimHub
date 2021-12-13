import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { StatisticApi } from '../../api/statisticApi';

export const getStatisticByMonthInYear = createAsyncThunk(
  'statistic/getStatisticByMonthInYear',
  async payload => {
    try {
      const response = await StatisticApi.getStatisticByMonthsInYears(payload);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const getStatisticByMoviesInDate = createAsyncThunk(
  'statistic/getStatisticByMoviesInDate',
  async payload => {
    try {
      const response = await StatisticApi.getStatisticByMoviesInDate(payload);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const getStatisticByMoviesInMonth = createAsyncThunk(
  'statistic/getStatisticByMoviesInMonth',
  async payload => {
    try {
      const response = await StatisticApi.getStatisticByMoviesInMonth(payload);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const getStatisticByYears = createAsyncThunk(
  'statistic/getStatisticByYears',
  async payload => {
    try {
      const response = await StatisticApi.getStatisticByYears(payload);
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
    [getStatisticByMonthInYear.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.result;
      }
    },
    [getStatisticByMonthInYear.rejected]: (state, action) => {
      state.current = null;
    },
    [getStatisticByYears.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.result;
      }
    },
    [getStatisticByYears.rejected]: (state, action) => {
      state.current = null;
    },
    [getStatisticByMoviesInDate.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.result;
      }
    },
    [getStatisticByMoviesInDate.rejected]: (state, action) => {
      state.current = null;
    },
    [getStatisticByMoviesInMonth.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.result;
      }
    },
    [getStatisticByMoviesInMonth.rejected]: (state, action) => {
      state.current = null;
    },
  },
});

const { reducer } = staffSlice;
export default reducer;
