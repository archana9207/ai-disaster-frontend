import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  accessToken: string | null;
  setAuth: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setAuth: (user, token) => {
        // Persist via Zustand (writes to auth-storage in localStorage)
        set({ user, accessToken: token });
        // Also write raw key so the axios request interceptor can read it
        // without importing the store (avoids circular dep issues)
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', token);
        }
      },

      logout: () => {
        set({ user: null, accessToken: null });
        // BUG FIX: original logout only removed 'access_token' but Zustand
        // persist also stores state under 'auth-storage'. Both must be cleared
        // so that a page refresh after logout doesn't restore the session.
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('auth-storage');
        }
      },
    }),
    {
      name: 'auth-storage',
      storage:
        typeof window !== 'undefined'
          ? createJSONStorage(() => localStorage)
          : undefined,
    }
  )
);