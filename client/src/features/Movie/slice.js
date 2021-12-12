import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import movieApi from 'api/movieApi';

export const loadMovies = createAsyncThunk('movies/load', async () => {
  try {
    const response = await movieApi.loadMovies();
    return response;
  } catch (error) {
    if (error.response) return error.response.data;
    else return { success: false, message: error.message };
  }
});

export const createMovie = createAsyncThunk(
  'movies/create',
  async (payload, { dispatch }) => {
    try {
      const response = await movieApi.createMovie(payload);
      // await dispatch(loadMovies());
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const deleteMovie = createAsyncThunk('movies/delete', async payload => {
  try {
    const response = await movieApi.deleteMovie(payload.id);
    return response;
  } catch (error) {
    if (error.response) return error.response.data;
    else return { success: false, message: error.message, invalid: 'server' };
  }
});

export const getMovieById = createAsyncThunk(
  'movies/getMovieById',
  async payload => {
    try {
      const response = await movieApi.getMovieById(payload.id);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

export const updateMovieById = createAsyncThunk(
  'movies/updateMovieById',
  async payload => {
    try {
      const response = await movieApi.updateMovieById(payload.id, payload.data);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message, invalid: 'server' };
    }
  },
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    current: null,
  },
  reducers: {},
  extraReducers: {
    [loadMovies.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.allMovies;
      }
    },
    [loadMovies.rejected]: (state, action) => {
      state.current = null;
    },
  },
});

const { reducer } = movieSlice;
export default reducer;
