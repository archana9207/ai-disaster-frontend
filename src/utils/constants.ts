import { DisasterType } from '@/src/types';

// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    REFRESH: '/token/refresh/',
  },
  PREDICTION: {
    PREDICT: '/predict/',
  },
  ANALYTICS: {
    HISTORY: '/analytics/history/',
    SUMMARY: '/analytics/summary/',
  },
} as const;

// Disaster metadata
export const DISASTER_TYPES: DisasterType[] = ['Flood', 'Drought', 'Storm', 'Normal'];

export const DISASTER_COLORS: Record<DisasterType, string> = {
  Flood: '#3b82f6',   // blue-500
  Drought: '#f59e0b', // amber-500
  Storm: '#06b6d4',   // cyan-500
  Normal: '#10b981',  // emerald-500
};

export const DISASTER_BADGE_STYLES: Record<DisasterType, string> = {
  Flood: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Drought: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Storm: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Normal: 'bg-green-500/20 text-green-300 border-green-500/30',
};

// Form validation limits (based on real-world ranges)
export const WEATHER_LIMITS = {
  temperature: { min: -50, max: 60, step: 0.1, unit: '°C' },
  humidity: { min: 0, max: 100, step: 1, unit: '%' },
  precipitation: { min: 0, max: 500, step: 0.1, unit: 'mm' },
  windSpeed: { min: 0, max: 200, step: 0.1, unit: 'km/h' },
  pressure: { min: 800, max: 1100, step: 0.1, unit: 'mb' },
};

// Chart configuration
export const CHART_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#f59e0b', // orange
  '#10b981', // green
  '#8b5cf6', // purple
  '#ec4899', // pink
];

// Default SHAP explanation keys (ordered)
export const SHAP_FEATURES = [
  { key: 'Temperature', label: 'Temperature (°C)', icon: 'thermometer' },
  { key: 'Humidity', label: 'Humidity (%)', icon: 'droplet' },
  { key: 'Precipitation', label: 'Precipitation (mm)', icon: 'cloud-rain' },
  { key: 'Wind Speed', label: 'Wind Speed (km/h)', icon: 'wind' },
  { key: 'Pressure', label: 'Pressure (mb)', icon: 'gauge' },
] as const;

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
} as const;

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PREDICT: '/predict',
  HISTORY: '/history',
  ANALYTICS: '/analytics',
} as const;

// Toast / notification durations (ms)
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
} as const;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;