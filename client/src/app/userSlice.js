import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userApi from 'api/userApi';
import StorageKeys from 'constants/storageKeys';

export const login = createAsyncThunk(
  'user/login',
  async (payload, { dispatch }) => {
    try {
      const response = await userApi.login(payload);
      if (response.success)
        localStorage.setItem(StorageKeys.access, response.token);

      await dispatch(loadUser());

      return response;
    } catch (error) {
      if (error.response) return error.response.data;
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

    if (error.response) return error.response.data;
    else return { success: false, message: error.message };
  }
});

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async payload => {
    try {
      const response = await userApi.changePassword(payload);
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  },
);

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
      if (!!action.payload) {
        state.current = action.payload.staff;
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
