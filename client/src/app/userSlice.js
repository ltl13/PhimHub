import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userApi from 'api/userApi';
import StorageKeys from 'constants/storage-keys';

export const login = createAsyncThunk('users/login', async payload => {
  try {
    const response = await userApi.login(payload);
    localStorage.setItem(StorageKeys.access, response.data.token);
    return response;
  } catch (error) {
    if (error.response) return { ...error.response };
    else return { success: false, message: error.message };
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    current: {},
  },
  reducers: {
    logout(state) {
      state.current = {};
      localStorage.removeItem(StorageKeys.access);
      localStorage.removeItem(StorageKeys.user);
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;
export default reducer;
