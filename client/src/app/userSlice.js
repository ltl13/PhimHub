import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userApi from 'api/userApi';
import StorageKeys from 'constants/storage-keys';

export const login = createAsyncThunk('users/login', async payload => {
  try {
    const response = await userApi.login(payload);
    localStorage.setItem(StorageKeys.access, response.token);
    localStorage.setItem(StorageKeys.user, response.user._id);
    return response;
  } catch (err) {
    console.log(err);
    return err.message;
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
