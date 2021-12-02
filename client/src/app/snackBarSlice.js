import { createSlice } from '@reduxjs/toolkit';

const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState: {
    type: 'success',
    message: '',
    open: false,
  },
  reducers: {
    openSnackBar(state, action) {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    closeSnackBar(state, action) {
      state.open = false;
    },
  },
});

const { actions, reducer } = snackBarSlice;
export const { openSnackBar, closeSnackBar } = actions;
export default reducer;
