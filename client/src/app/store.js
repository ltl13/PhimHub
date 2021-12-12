import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from 'app/userSlice';
import snackBarReducer from 'app/snackBarSlice';
import backdropReducer from 'app/backdropSlice';
import authorizationReducer from 'features/Authorization/slice';
import staffReducer from 'features/Staff/slice';
import customerReducer from 'features/Customer/slice';
import movieReducer from 'features/Movie/slice';
import movieTypeReducer from 'features/Movie/movieTypeSlice';
import roomTypeReducer from 'features/RoomType/slice';

const rootReducer = {
  user: userReducer,
  staffTypes: authorizationReducer,
  staffs: staffReducer,
  snackBar: snackBarReducer,
  backdrop: backdropReducer,
  movies: movieReducer,
  movieTypes: movieTypeReducer,
  customers: customerReducer,
  roomTypes: roomTypeReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
