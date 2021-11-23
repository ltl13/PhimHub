import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from 'app/userSlice';
import authorizationReducer from 'features/Authorization/slice';

const rootReducer = {
  user: userReducer,
  staffType: authorizationReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
