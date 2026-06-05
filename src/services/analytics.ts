import api from './api';

export const getHistory = (limit: number = 10) =>
  api.get(`/analytics/history/?limit=${limit}`);

export const getSummary = () =>
  api.get('/analytics/summary/');