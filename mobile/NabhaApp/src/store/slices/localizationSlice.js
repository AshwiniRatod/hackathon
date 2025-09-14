import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLanguage: 'en',
  availableLanguages: ['en', 'hi', 'pa'],
  translations: {},
  isRTL: false,
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  currency: 'INR',
  loading: false,
};

const localizationSlice = createSlice({
  name: 'localization',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      state.isRTL = ['ar', 'he', 'fa'].includes(action.payload);
    },
    setTranslations: (state, action) => {
      state.translations = action.payload;
    },
    setDateFormat: (state, action) => {
      state.dateFormat = action.payload;
    },
    setTimeFormat: (state, action) => {
      state.timeFormat = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setLanguage,
  setTranslations,
  setDateFormat,
  setTimeFormat,
  setCurrency,
  setLoading,
} = localizationSlice.actions;

export default localizationSlice.reducer;
