import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const baseURL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ List of endpoints that should NOT include the token
const publicEndpoints = ['/auth/login/', '/auth/register/'];

api.interceptors.request.use((config) => {
  // Skip token for public auth endpoints
  const isPublic = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
  if (!isPublic) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;