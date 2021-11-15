import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from 'app/userSlice';

const rootReducer = {
  user: userReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
