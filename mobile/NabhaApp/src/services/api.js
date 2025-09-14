import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';
import io from 'socket.io-client';

// Use environment variables from .env file
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.5:3000/api';
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://192.168.1.5:3000';
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT) || 30000;
const SOCKET_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_SOCKET_TIMEOUT) || 5000;

console.log('🔧 API Configuration:');
console.log(`📡 API Base URL: ${API_BASE_URL}`);
console.log(`🔌 Socket URL: ${SOCKET_URL}`);
console.log(`⏱️ API Timeout: ${API_TIMEOUT}ms`);
console.log(`⏱️ Socket Timeout: ${SOCKET_TIMEOUT}ms`);

// Socket.IO client for real-time updates
let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    console.log(`🔌 Initializing Socket.IO connection to: ${SOCKET_URL}`);
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      timeout: SOCKET_TIMEOUT,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      console.log(`🏠 Joining room: mobile-app`);
      socket.emit('join-room', 'mobile-app');
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Create axios instance with environment variables
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log(`🔧 Axios instance created with timeout: ${API_TIMEOUT}ms`);

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiry
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.multiRemove(['auth_token', 'user_data']);
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  verifyOTP: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
  resendOTP: (phone) => api.post('/auth/resend-otp', { phone }),
  login: (phone, password) => api.post('/auth/login', { phone, password }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

// Patient API
export const patientAPI = {
  getPatients: () => api.get('/patients'),
  getPatient: (id) => api.get(`/patients/${id}`),
  createPatient: (patientData) => api.post('/patients', patientData),
  updatePatient: (id, patientData) => api.put(`/patients/${id}`, patientData),
  deletePatient: (id) => api.delete(`/patients/${id}`),
  getHealthRecords: (patientId) => api.get(`/patients/${patientId}/health-records`),
  addHealthRecord: (patientId, recordData) => 
    api.post(`/patients/${patientId}/health-records`, recordData),
};

// Doctor API
export const doctorAPI = {
  getDoctors: () => api.get('/doctors'),
  getDoctor: (id) => api.get(`/doctors/${id}`),
  getAvailableDoctors: () => api.get('/doctors/available'),
  getDoctorsBySpecialization: (specialization) => 
    api.get(`/doctors/specialization/${specialization}`),
  bookConsultation: (consultationData) => 
    api.post('/doctors/book-consultation', consultationData),
  getConsultations: (patientId) => api.get(`/doctors/consultations/${patientId}`),
  
  // Enhanced doctor endpoints
  getAvailableDoctors: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/doctors/available?${params}`);
      return response.data;
    } catch (error) {
      console.error('Get doctors error:', error);
      throw error;
    }
  },

  getDoctorById: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Get doctor error:', error);
      throw error;
    }
  },

  searchBySpecialty: async (specialty, page = 1) => {
    return await doctorsAPI.getAvailableDoctors({ specialty, page });
  }
};

// Real-time doctor updates handler
export const subscribeToDoctorUpdates = (callback) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.on('doctor-added', (data) => {
      console.log('New doctor added:', data);
      callback('doctor-added', data);
    });

    currentSocket.on('doctor-updated', (data) => {
      console.log('Doctor updated:', data);
      callback('doctor-updated', data);
    });

    return () => {
      currentSocket.off('doctor-added');
      currentSocket.off('doctor-updated');
    };
  }
  return null;
};

// Health Records API
export const healthRecordsAPI = {
  getRecords: (patientId) => api.get(`/health-records/${patientId}`),
  addRecord: (recordData) => api.post('/health-records', recordData),
  updateRecord: (id, recordData) => api.put(`/health-records/${id}`, recordData),
  deleteRecord: (id) => api.delete(`/health-records/${id}`),
  getLastDiagnoses: (patientId, limit = 5) => 
    api.get(`/health-records/${patientId}/diagnoses?limit=${limit}`),
};

// Prescription API
export const prescriptionAPI = {
  getPrescriptions: (patientId) => api.get(`/prescriptions/${patientId}`),
  addPrescription: (prescriptionData) => api.post('/prescriptions', prescriptionData),
  updatePrescription: (id, prescriptionData) => 
    api.put(`/prescriptions/${id}`, prescriptionData),
  getPrescriptionDetails: (id) => api.get(`/prescriptions/details/${id}`),
};

// SOS API (Legacy)
export const sosAPI = {
  createAlert: (alertData) => api.post('/sos/alert', alertData),
  getAlerts: (patientId) => api.get(`/sos/alerts/${patientId}`),
  updateAlertStatus: (alertId, status) => 
    api.put(`/sos/alerts/${alertId}/status`, { status }),
  getEmergencyContacts: (patientId) => api.get(`/sos/emergency-contacts/${patientId}`),
  addEmergencyContact: (patientId, contactData) => 
    api.post(`/sos/emergency-contacts/${patientId}`, contactData),
};

// Enhanced Emergency API
export const emergencyAPI = {
  // Send comprehensive SOS alert
  sendSOSAlert: (alertData) => api.post('/emergency/sos-alert', alertData),
  
  // Update alert status
  updateAlertStatus: (alertId, status, notes = '') => 
    api.put(`/emergency/alerts/${alertId}/status`, { status, notes }),
  
  // Get alert history
  getAlertHistory: (userId, limit = 10, offset = 0) => 
    api.get(`/emergency/alerts/history/${userId}?limit=${limit}&offset=${offset}`),
  
  // Get emergency contacts
  getEmergencyContacts: (userId) => 
    api.get(`/users/${userId}/emergency-contacts`),
  
  // Get nearby emergency responders
  getNearbyResponders: (latitude, longitude, radius = 10) => 
    api.get(`/emergency/nearby-responders?latitude=${latitude}&longitude=${longitude}&radius=${radius}`),
  
  // Test emergency system
  testEmergencySystem: () => api.post('/emergency/test'),
  
  // Health check
  healthCheck: () => api.get('/emergency/health'),
};

// ASHA API
export const ashaAPI = {
  getReports: () => api.get('/asha/reports'),
  createReport: (reportData) => api.post('/asha/reports', reportData),
  updateReport: (id, reportData) => api.put(`/asha/reports/${id}`, reportData),
  getAssignedPatients: () => api.get('/asha/patients'),
  addPatientVisit: (visitData) => api.post('/asha/visits', visitData),
  getVisitHistory: (patientId) => api.get(`/asha/visits/${patientId}`),
};

// Pharmacy API
export const pharmacyAPI = {
  getPharmacies: () => api.get('/pharmacy'),
  searchMedicine: (query) => api.get(`/pharmacy/search?q=${query}`),
  checkAvailability: (medicineId, location) => 
    api.get(`/pharmacy/availability/${medicineId}?location=${location}`),
  orderMedicine: (orderData) => api.post('/pharmacy/order', orderData),
  getOrders: (patientId) => api.get(`/pharmacy/orders/${patientId}`),
};

export default api;
