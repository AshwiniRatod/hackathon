import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isEmergency: false,
  emergencyType: null,
  location: null,
  emergencyContacts: [],
  responseTeam: [],
  sosHistory: [],
  activeAlert: null,
  loading: false,
  error: null,
};

const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    activateEmergency: (state, action) => {
      state.isEmergency = true;
      state.emergencyType = action.payload.type;
      state.location = action.payload.location;
      state.activeAlert = action.payload;
    },
    deactivateEmergency: (state) => {
      state.isEmergency = false;
      state.emergencyType = null;
      state.activeAlert = null;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setEmergencyContacts: (state, action) => {
      state.emergencyContacts = action.payload;
    },
    setResponseTeam: (state, action) => {
      state.responseTeam = action.payload;
    },
    addToSOSHistory: (state, action) => {
      state.sosHistory.unshift(action.payload);
    },
    setSOSHistory: (state, action) => {
      state.sosHistory = action.payload;
    },
    updateActiveAlert: (state, action) => {
      state.activeAlert = { ...state.activeAlert, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  activateEmergency,
  deactivateEmergency,
  setLocation,
  setEmergencyContacts,
  setResponseTeam,
  addToSOSHistory,
  setSOSHistory,
  updateActiveAlert,
  setLoading,
  setError,
  clearError,
} = emergencySlice.actions;

export default emergencySlice.reducer;
