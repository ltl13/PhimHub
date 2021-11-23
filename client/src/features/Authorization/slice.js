import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import staffTypeApi from 'api/staffTypeApi';

export const loadStaffType = createAsyncThunk('staffType/load', async () => {
  try {
    const response = await staffTypeApi.getAllStaffType();
    return response;
  } catch (error) {
    if (error.response) return error.response;
    else return { success: false, message: error.message };
  }
});

export const updateStaffType = createAsyncThunk(
  'staffType/update',
  async ({ funcs, id }) => {
    try {
      const response = await staffTypeApi.updateStaffTypeById(
        { funcs: funcs },
        id,
      );
      return response;
    } catch (error) {
      if (error.response) return error.response;
      else return { success: false, message: error.message };
    }
  },
);

export const updateAllStaffType = createAsyncThunk(
  'staffType/update',
  async (payload, { dispatch }) => {
    try {
      let hasError = false;
      // payload.data.forEach(async item => {
      //   const action = updateStaffType({ funcs: item.funcs, id: item.id });
      //   const response = await dispatch(action);
      //   // hasError = hasError || !response.payload.success;
      // });
      for (let i = 0; i < payload.data.length; i++) {
        const action = updateStaffType({
          funcs: payload.data[i].funcs,
          id: payload.data[i].id,
        });
        const response = await dispatch(action);
        hasError = hasError || !response.payload.success;
      }

      if (hasError) {
        return { success: false, message: 'Cập nhật thất bại' };
      } else {
        return { success: true, message: 'Cập nhật thành công' };
      }
    } catch (error) {
      if (error.response) return error.response;
      else return { success: false, message: error.message };
    }
  },
);

export const createStaffType = createAsyncThunk(
  'staffType/create',
  async (payload, { dispatch }) => {
    try {
      const response = await staffTypeApi.createStaffType(payload);
      await dispatch(loadStaffType());
      return response;
    } catch (error) {
      if (error.response) return error.response;
      else return { success: false, message: error.message };
    }
  },
);

const authorizationSlice = createSlice({
  name: 'staffType',
  initialState: {
    current: null,
  },
  reducers: {},
  extraReducers: {
    [loadStaffType.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.allStaffTypes;
      }
    },
    [loadStaffType.rejected]: (state, action) => {
      state.current = null;
    },
  },
});

const { actions, reducer } = authorizationSlice;
export default reducer;
