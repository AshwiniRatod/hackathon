import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeConsultation: null,
  consultationHistory: [],
  availableDoctors: [],
  queuePosition: null,
  waitTime: null,
  callStatus: 'idle', // idle, connecting, connected, ended
  callType: null, // video, audio, chat
  loading: false,
  error: null,
};

const consultationSlice = createSlice({
  name: 'consultation',
  initialState,
  reducers: {
    startConsultation: (state, action) => {
      state.activeConsultation = action.payload;
      state.callStatus = 'connecting';
    },
    setCallStatus: (state, action) => {
      state.callStatus = action.payload;
    },
    setCallType: (state, action) => {
      state.callType = action.payload;
    },
    endConsultation: (state) => {
      state.activeConsultation = null;
      state.callStatus = 'idle';
      state.callType = null;
      state.queuePosition = null;
      state.waitTime = null;
    },
    setAvailableDoctors: (state, action) => {
      state.availableDoctors = action.payload;
    },
    setQueuePosition: (state, action) => {
      state.queuePosition = action.payload;
    },
    setWaitTime: (state, action) => {
      state.waitTime = action.payload;
    },
    addToHistory: (state, action) => {
      state.consultationHistory.unshift(action.payload);
    },
    setConsultationHistory: (state, action) => {
      state.consultationHistory = action.payload;
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
  startConsultation,
  setCallStatus,
  setCallType,
  endConsultation,
  setAvailableDoctors,
  setQueuePosition,
  setWaitTime,
  addToHistory,
  setConsultationHistory,
  setLoading,
  setError,
  clearError,
} = consultationSlice.actions;

export default consultationSlice.reducer;
