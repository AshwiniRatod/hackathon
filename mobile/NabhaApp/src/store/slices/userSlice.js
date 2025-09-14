import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  healthId: null,
  emergencyContacts: [],
  medicalConditions: [],
  allergies: [],
  familyMembers: [],
  language: 'en',
  location: null,
  preferences: {
    notifications: true,
    biometric: false,
    language: 'en',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setHealthId: (state, action) => {
      state.healthId = action.payload;
    },
    setEmergencyContacts: (state, action) => {
      state.emergencyContacts = action.payload;
    },
    addEmergencyContact: (state, action) => {
      state.emergencyContacts.push(action.payload);
    },
    removeEmergencyContact: (state, action) => {
      state.emergencyContacts = state.emergencyContacts.filter(
        contact => contact.id !== action.payload
      );
    },
    setMedicalConditions: (state, action) => {
      state.medicalConditions = action.payload;
    },
    addMedicalCondition: (state, action) => {
      state.medicalConditions.push(action.payload);
    },
    setAllergies: (state, action) => {
      state.allergies = action.payload;
    },
    addAllergy: (state, action) => {
      state.allergies.push(action.payload);
    },
    setFamilyMembers: (state, action) => {
      state.familyMembers = action.payload;
    },
    addFamilyMember: (state, action) => {
      state.familyMembers.push(action.payload);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      state.preferences.language = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const {
  setProfile,
  setHealthId,
  setEmergencyContacts,
  addEmergencyContact,
  removeEmergencyContact,
  setMedicalConditions,
  addMedicalCondition,
  setAllergies,
  addAllergy,
  setFamilyMembers,
  addFamilyMember,
  setLanguage,
  setLocation,
  updatePreferences,
} = userSlice.actions;

export default userSlice.reducer;
