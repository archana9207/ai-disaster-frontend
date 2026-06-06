'use client';
import { User, Bell } from 'lucide-react';
import { useAuthStore } from '@/src/store/authStore';

// BUG FIX: removed `glass` and `border-white/10` class references that are not
// defined anywhere in globals.css, causing the header to render as an invisible
// or broken element. Replaced with explicit inline styles consistent with the
// rest of the dark theme.
export function Navbar() {
  const { user } = useAuthStore();

  return (
    <header
      className="px-6 py-4 flex justify-between items-center shrink-0"
      style={{
        background: '#070e1f',
        borderBottom: '1px solid rgba(59,130,246,0.1)',
      }}
    >
      <div className="flex items-center gap-4">
        <h2 className="text-base font-semibold text-slate-200">
          Welcome back,{' '}
          <span className="text-blue-400">{user?.username || 'User'}</span>
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-500" />
        </button>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
          >
            {(user?.username || 'U')[0].toUpperCase()}
          </div>
          <span className="text-xs text-slate-300">{user?.username || 'User'}</span>
        </div>
      </div>
    </header>
  );
}