// Authentication types
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// Prediction types
export interface WeatherData {
  temperature_celsius: number;
  humidity: number;
  precip_mm: number;
  wind_kph: number;
  pressure_mb: number;
}

export interface ShapExplanation {
  Temperature: number;
  Humidity: number;
  Precipitation: number;
  WindSpeed: number;
  Pressure: number;
}

export interface PredictionResponse {
  disaster_type: DisasterType;
  recommendation: string;
  actions: string[];
  shap_explanation: ShapExplanation | null;
  message: string;
}

export type DisasterType = 'Flood' | 'Drought' | 'Storm' | 'Normal';

// History & Analytics types
export interface PredictionHistory {
  id: number;
  temperature: number;
  humidity: number;
  precip_mm: number;
  wind_kph: number;
  pressure_mb: number;
  predicted_disaster: DisasterType;
  created_at: string; // ISO datetime
}

export interface DisasterBreakdown {
  disaster_type: DisasterType;
  count: number;
}

export interface MonthlyTrend {
  month: string; // "YYYY-MM"
  counts: Partial<Record<DisasterType, number>>;
  total: number;
}

export interface AnalyticsSummary {
  total_predictions: number;
  disaster_breakdown: DisasterBreakdown[];
  most_common_disaster: DisasterType | null;
  recent_predictions: PredictionHistory[];
  monthly_trends: MonthlyTrend[];
}

// API error response
export interface ApiError {
  error?: string;
  detail?: string;
  details?: Record<string, string[]>;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}