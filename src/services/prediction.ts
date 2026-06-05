import api from './api';

export interface WeatherData {
  temperature_celsius: number;
  humidity: number;
  precip_mm: number;
  wind_kph: number;
  pressure_mb: number;
}

export const predictDisaster = (data: WeatherData) =>
  api.post('/predict/', data);