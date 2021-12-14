import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ticketTypeApi from 'api/ticketTypeApi';

export const getAllTicketType = createAsyncThunk(
  'ticketType/load',
  async () => {
    try {
      const response = await ticketTypeApi.getAllTicketType();
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  },
);

export const updateTicketType = createAsyncThunk(
  'ticketType/update',
  async ({ funcs, id }) => {
    try {
      const response = await ticketTypeApi.updateTicketTypeById(
        { funcs: funcs },
        id,
      );
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  },
);

export const updateAllTicketType = createAsyncThunk(
  'ticketType/update',
  async (payload, { dispatch }) => {
    try {
      let hasError = false;
      // payload.data.forEach(async item => {
      //   const action = updateTicketType({ funcs: item.funcs, id: item.id });
      //   const response = await dispatch(action);
      //   // hasError = hasError || !response.payload.success;
      // });
      for (let i = 0; i < payload.data.length; i++) {
        const action = updateTicketType({
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
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  },
);

export const createTicketType = createAsyncThunk(
  'ticketType/create',
  async (payload, { dispatch }) => {
    try {
      const response = await ticketTypeApi.createTicketType(payload);
      // await dispatch(loadticketType());
      return response;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  },
);

const authorizationSlice = createSlice({
  name: 'ticketTypes',
  initialState: {
    current: null,
  },
  reducers: {},
  extraReducers: {
    [getAllTicketType.fulfilled]: (state, action) => {
      if (!!action.payload) {
        state.current = action.payload.allTicketTypes;
      }
    },
    [getAllTicketType.rejected]: (state, action) => {
      state.current = null;
    },
  },
});

const { reducer } = authorizationSlice;
export default reducer;
