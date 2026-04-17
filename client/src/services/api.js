import axiosClient from '../api/axiosClient';

// Finance API service
export const financeService = {
  // Get financial profile
  getProfile: async () => {
    const response = await axiosClient.get('/finance/profile');
    return response.data;
  },

  // Save financial profile
  saveProfile: async (profileData) => {
    const response = await axiosClient.post('/finance/profile', profileData);
    return response.data;
  },

  // Save simulation
  saveSimulation: async (simulationData) => {
    const response = await axiosClient.post('/finance/simulations', simulationData);
    return response.data;
  },

  // Get simulations
  getSimulations: async (type = null) => {
    const params = type ? { type } : {};
    const response = await axiosClient.get('/finance/simulations', { params });
    return response.data;
  },

  // Analyze leaks
  analyzeLeaks: async () => {
    const response = await axiosClient.post('/leaks/analyze');
    return response;
  },
};

// Auth service
export const authService = {
  signup: async (userData) => {
    const response = await axiosClient.post('/auth/signup', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },
};
