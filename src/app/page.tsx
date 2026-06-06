'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/authStore';

export default function Home() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  // BUG FIX: wait until client mount so Zustand persist has hydrated before
  // deciding which route to redirect to. Without this, SSR renders with
  // accessToken=null and always sends users to /login even when they're
  // logged in, breaking back-navigation after page refresh.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (accessToken) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [mounted, accessToken, router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#060c1a' }}
    >
      <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
    </div>
  );
}