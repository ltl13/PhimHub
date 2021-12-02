import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from 'app/userSlice';
import snackBarReducer from 'app/snackBarSlice';
import backdropReducer from 'app/backdropSlice';
import authorizationReducer from 'features/Authorization/slice';
import staffReducer from 'features/Staff/slice';

const rootReducer = {
  user: userReducer,
  staffType: authorizationReducer,
  staffs: staffReducer,
  snackBar: snackBarReducer,
  backdrop: backdropReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
