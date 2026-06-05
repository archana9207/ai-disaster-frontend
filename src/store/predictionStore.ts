import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { predictDisaster, WeatherData } from '@/src/services/prediction';

export interface PredictionResult {
  disaster_type: string;
  recommendation: string;
  actions: string[];
  shap_explanation: Record<string, number> | null;
  message: string;
}

interface PredictionState {
  // State
  currentResult: PredictionResult | null;
  isLoading: boolean;
  error: string | null;
  recentPredictions: PredictionResult[]; // store last 5 results for quick access

  // Actions
  makePrediction: (data: WeatherData) => Promise<void>;
  clearResult: () => void;
  clearError: () => void;
  addToRecent: (result: PredictionResult) => void;
}

export const usePredictionStore = create<PredictionState>()(
  (set, get) => ({
    // Initial state
    currentResult: null,
    isLoading: false,
    error: null,
    recentPredictions: [],

    // Make a new prediction
    makePrediction: async (data: WeatherData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await predictDisaster(data);
        const result = response.data;
        set({ currentResult: result, isLoading: false });
        // Add to recent predictions
        get().addToRecent(result);
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || err.message || 'Prediction failed';
        set({ error: errorMsg, isLoading: false, currentResult: null });
      }
    },

    // Clear current result
    clearResult: () => {
      set({ currentResult: null });
    },

    // Clear error message
    clearError: () => {
      set({ error: null });
    },

    // Store recent predictions (max 5)
    addToRecent: (result: PredictionResult) => {
      set((state) => ({
        recentPredictions: [result, ...state.recentPredictions].slice(0, 5),
      }));
    },
  })
);