import { createSlice } from '@reduxjs/toolkit';

const backdropSlice = createSlice({
  name: 'backdrop',
  initialState: {
    open: false,
  },
  reducers: {
    openBackdrop(state, action) {
      state.open = true;
    },
    closeBackdrop(state, action) {
      state.open = false;
    },
  },
});

const { actions, reducer } = backdropSlice;
export const { openBackdrop, closeBackdrop } = actions;
export default reducer;
