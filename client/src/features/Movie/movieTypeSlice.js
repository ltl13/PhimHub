import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import movieTypeApi from 'api/movieTypeApi';

export const loadMovieType = createAsyncThunk('movieType/load', async () => {
  try {
    const response = await movieTypeApi.getAllMovieType();
    return response;
  } catch (error) {
    if (error.response) return error.response.data;
    else return { success: false, message: error.message };
  }
});

export const createMovieType = createAsyncThunk(
  'movieType/create',
  async (payload, { dispatch }) => {
    try {
      const response = await movieTypeApi.createMovieType(payload);
      await dispatch(loadMovieType());
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  },
);

const movieTypeSlice = createSlice({
  name: 'movieTypes',
  initialState: {
    current: null,
  },
  reducers: {},
  extraReducers: {
    [loadMovieType.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.allMovieTypes;
      }
    },
    [loadMovieType.rejected]: (state, action) => {
      state.current = null;
    },
  },
});

const { reducer } = movieTypeSlice;
export default reducer;
