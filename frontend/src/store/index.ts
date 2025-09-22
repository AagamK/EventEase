import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import eventSlice from './slices/eventSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    events: eventSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // Fixed this line