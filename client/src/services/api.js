import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  refresh: (refreshToken) => api.post('/api/auth/refresh', { refreshToken }),
  getMe: () => api.get('/api/auth/me'),
};

// Threats APIs
export const threatsAPI = {
  getAll: (params) => api.get('/api/threats', { params }),
  getById: (id) => api.get(`/api/threats/${id}`),
  create: (data) => api.post('/api/threats', data),
  update: (id, data) => api.put(`/api/threats/${id}`, data),
  delete: (id) => api.delete(`/api/threats/${id}`),
  getStats: () => api.get('/api/threats/stats'),
};

// Alerts APIs
export const alertsAPI = {
  getAll: (params) => api.get('/api/alerts', { params }),
  getById: (id) => api.get(`/api/alerts/${id}`),
  create: (data) => api.post('/api/alerts', data),
  update: (id, data) => api.put(`/api/alerts/${id}`, data),
  acknowledge: (id) => api.put(`/api/alerts/${id}/acknowledge`),
  resolve: (id, resolution) => api.put(`/api/alerts/${id}/resolve`, { resolution }),
  delete: (id) => api.delete(`/api/alerts/${id}`),
  getStats: () => api.get('/api/alerts/stats'),
};

// Incidents APIs
export const incidentsAPI = {
  getAll: (params) => api.get('/api/incidents', { params }),
  getById: (id) => api.get(`/api/incidents/${id}`),
  create: (data) => api.post('/api/incidents', data),
  update: (id, data) => api.put(`/api/incidents/${id}`, data),
  assign: (id, userId) => api.put(`/api/incidents/${id}/assign`, { userId }),
  updateStatus: (id, status) => api.put(`/api/incidents/${id}/status`, { status }),
  addNote: (id, note) => api.post(`/api/incidents/${id}/notes`, { note }),
  delete: (id) => api.delete(`/api/incidents/${id}`),
  getStats: () => api.get('/api/incidents/stats'),
};

// Logs APIs
export const logsAPI = {
  getAll: (params) => api.get('/api/logs', { params }),
  getById: (id) => api.get(`/api/logs/${id}`),
  search: (query) => api.post('/api/logs/search', query),
  export: (params) => api.get('/api/logs/export', { params, responseType: 'blob' }),
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => api.get('/api/analytics/dashboard'),
  getThreats: (timeRange) => api.get('/api/analytics/threats', { params: { timeRange } }),
  getTimeline: (timeRange) => api.get('/api/analytics/timeline', { params: { timeRange } }),
  getGeoData: () => api.get('/api/analytics/geo'),
  getTopAttackers: (limit) => api.get('/api/analytics/top-attackers', { params: { limit } }),
  getThreatTrends: (days) => api.get('/api/analytics/threat-trends', { params: { days } }),
};

// Users APIs
export const usersAPI = {
  getAll: (params) => api.get('/api/users', { params }),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (data) => api.post('/api/users', data),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  delete: (id) => api.delete(`/api/users/${id}`),
  updateRole: (id, role) => api.put(`/api/users/${id}/role`, { role }),
};

// ML Service APIs
export const mlAPI = {
  predict: (data) => api.post('/api/ml/predict', data),
  analyze: (data) => api.post('/api/ml/analyze', data),
  getInsights: () => api.get('/api/ml/insights'),
  trainModel: (data) => api.post('/api/ml/train', data),
};

// Settings APIs
export const settingsAPI = {
  get: () => api.get('/api/settings'),
  update: (data) => api.put('/api/settings', data),
  getNotifications: () => api.get('/api/settings/notifications'),
  updateNotifications: (data) => api.put('/api/settings/notifications', data),
};

// Reports APIs
export const reportsAPI = {
  generate: (type, params) => api.post('/api/reports/generate', { type, ...params }),
  getAll: () => api.get('/api/reports'),
  getById: (id) => api.get(`/api/reports/${id}`),
  download: (id) => api.get(`/api/reports/${id}/download`, { responseType: 'blob' }),
  delete: (id) => api.delete(`/api/reports/${id}`),
};

export default api;
