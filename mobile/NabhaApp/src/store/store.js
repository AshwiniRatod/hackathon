import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import consultationSlice from './slices/consultationSlice';
import healthRecordsSlice from './slices/healthRecordsSlice';
import emergencySlice from './slices/emergencySlice';
import offlineSlice from './slices/offlineSlice';
import localizationSlice from './slices/localizationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    consultation: consultationSlice,
    healthRecords: healthRecordsSlice,
    emergency: emergencySlice,
    offline: offlineSlice,
    localization: localizationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
