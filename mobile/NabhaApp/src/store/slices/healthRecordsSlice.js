import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  records: [],
  prescriptions: [],
  labReports: [],
  vaccinations: [],
  symptoms: [],
  diagnoses: [],
  loading: false,
  error: null,
  lastSync: null,
};

const healthRecordsSlice = createSlice({
  name: 'healthRecords',
  initialState,
  reducers: {
    setRecords: (state, action) => {
      state.records = action.payload;
    },
    addRecord: (state, action) => {
      state.records.unshift(action.payload);
    },
    setPrescriptions: (state, action) => {
      state.prescriptions = action.payload;
    },
    addPrescription: (state, action) => {
      state.prescriptions.unshift(action.payload);
    },
    setLabReports: (state, action) => {
      state.labReports = action.payload;
    },
    addLabReport: (state, action) => {
      state.labReports.unshift(action.payload);
    },
    setVaccinations: (state, action) => {
      state.vaccinations = action.payload;
    },
    addVaccination: (state, action) => {
      state.vaccinations.push(action.payload);
    },
    setSymptoms: (state, action) => {
      state.symptoms = action.payload;
    },
    addSymptom: (state, action) => {
      state.symptoms.push(action.payload);
    },
    setDiagnoses: (state, action) => {
      state.diagnoses = action.payload;
    },
    addDiagnosis: (state, action) => {
      state.diagnoses.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLastSync: (state, action) => {
      state.lastSync = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setRecords,
  addRecord,
  setPrescriptions,
  addPrescription,
  setLabReports,
  addLabReport,
  setVaccinations,
  addVaccination,
  setSymptoms,
  addSymptom,
  setDiagnoses,
  addDiagnosis,
  setLoading,
  setError,
  setLastSync,
  clearError,
} = healthRecordsSlice.actions;

export default healthRecordsSlice.reducer;
