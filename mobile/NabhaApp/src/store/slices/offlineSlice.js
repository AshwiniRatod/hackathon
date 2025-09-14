import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOnline: true,
  syncQueue: [],
  lastSync: null,
  syncInProgress: false,
  pendingActions: [],
  offlineData: {},
  syncConflicts: [],
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    addToSyncQueue: (state, action) => {
      state.syncQueue.push({
        id: Date.now().toString(),
        action: action.payload,
        timestamp: new Date().toISOString(),
        priority: action.payload.priority || 'normal',
      });
    },
    removeFromSyncQueue: (state, action) => {
      state.syncQueue = state.syncQueue.filter(item => item.id !== action.payload);
    },
    clearSyncQueue: (state) => {
      state.syncQueue = [];
    },
    setSyncInProgress: (state, action) => {
      state.syncInProgress = action.payload;
    },
    setLastSync: (state, action) => {
      state.lastSync = action.payload;
    },
    addPendingAction: (state, action) => {
      state.pendingActions.push(action.payload);
    },
    removePendingAction: (state, action) => {
      state.pendingActions = state.pendingActions.filter(
        action => action.id !== action.payload
      );
    },
    setOfflineData: (state, action) => {
      state.offlineData = { ...state.offlineData, ...action.payload };
    },
    addSyncConflict: (state, action) => {
      state.syncConflicts.push(action.payload);
    },
    resolveSyncConflict: (state, action) => {
      state.syncConflicts = state.syncConflicts.filter(
        conflict => conflict.id !== action.payload
      );
    },
  },
});

export const {
  setOnlineStatus,
  addToSyncQueue,
  removeFromSyncQueue,
  clearSyncQueue,
  setSyncInProgress,
  setLastSync,
  addPendingAction,
  removePendingAction,
  setOfflineData,
  addSyncConflict,
  resolveSyncConflict,
} = offlineSlice.actions;

export default offlineSlice.reducer;
