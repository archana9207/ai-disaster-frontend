'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/authStore';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { Navbar } from '@/src/components/layout/Navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { accessToken } = useAuthStore();
  const router = useRouter();
  // BUG FIX: gate auth check on client-mount to avoid SSR hydration mismatch.
  // On the very first render (SSR), the Zustand persist store hasn't loaded
  // yet so accessToken is null. Without this flag we'd immediately redirect
  // every authenticated user back to /login on page refresh.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !accessToken) {
      router.replace('/login');
    }
  }, [mounted, accessToken, router]);

  // While store is hydrating, render nothing visible (avoids flash)
  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#060c1a' }}
      >
        <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  // Not authenticated — redirect is in flight, show nothing
  if (!accessToken) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#060c1a' }}>
      <Sidebar />
      {/* Main content area — offset by sidebar width on large screens */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-60">
        <Navbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}