'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/src/store/authStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Trigger Zustand persist rehydration from localStorage on first mount.
    // We do NOT block rendering - the store initialises synchronously from
    // localStorage via createJSONStorage, so by the time any child component
    // reads accessToken the value is already there.
    useAuthStore.persist.rehydrate();
  }, []);

  // Never return null here - that was causing a blank screen on every page load
  // because the hydration useEffect runs AFTER the first render, meaning
  // `hydrated` was always false on the very first paint.
  return <>{children}</>;
}