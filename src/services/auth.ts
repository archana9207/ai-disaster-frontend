import api from './api';

export const register = (data: { username: string; email: string; password: string }) =>
  api.post('/auth/register/', data);   // ✅ Note: no extra /id

export const login = (data: { username: string; password: string }) =>
  api.post('/auth/login/', data);