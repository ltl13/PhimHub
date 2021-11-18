import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userApi from 'api/userApi';
import StorageKeys from 'constants/storageKeys';

export const login = createAsyncThunk(
  'users/login',
  async (payload, { dispatch }) => {
    try {
      const response = await userApi.login(payload);
      if (response.data.success)
        localStorage.setItem(StorageKeys.access, response.data.token);

      await dispatch(loadUser());

      return response;
    } catch (error) {
      if (error.response) return error.response;
      else return { success: false, message: error.message };
    }
  },
);

export const loadUser = createAsyncThunk('user/loadUser', async () => {
  try {
    const response = await userApi.loadUser();
    return response;
  } catch (error) {
    localStorage.removeItem(StorageKeys.access);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    current: null,
    isLoggedIn: false,
  },
  reducers: {
    logout(state) {
      state.current = null;
      state.isLoggedIn = false;
      localStorage.removeItem(StorageKeys.access);
    },
  },
  extraReducers: {
    [loadUser.fulfilled]: (state, action) => {
      if (action.payload) {
        state.current = action.payload.data.staff;
        state.isLoggedIn = true;
      }
    },
    [loadUser.rejected]: (state, action) => {
      state.current = null;
      state.isLoggedIn = false;
    },
  },
});

const { actions, reducer } = userSlice;
export const { logout } = actions;
export default reducer;
