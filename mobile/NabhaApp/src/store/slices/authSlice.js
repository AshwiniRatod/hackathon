import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  isFirstLaunch: true,
  phoneNumber: '',
  otpVerified: false,
  biometricEnabled: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setOTPVerified: (state, action) => {
      state.otpVerified = action.payload;
    },
    setBiometricEnabled: (state, action) => {
      state.biometricEnabled = action.payload;
    },
    setFirstLaunch: (state, action) => {
      state.isFirstLaunch = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setPhoneNumber,
  setOTPVerified,
  setBiometricEnabled,
  setFirstLaunch,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
