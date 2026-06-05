'use client';
import { User, Bell } from 'lucide-react';
import { useAuthStore } from '@/src/store/authStore';

export function Navbar() {
  const { user } = useAuthStore();
  return (
    <header className="glass border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">Welcome back, {user?.username || 'User'}</h2>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="text-muted-foreground hover:text-foreground cursor-pointer" size={20} />
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
          <User size={16} />
          <span className="text-sm">{user?.username}</span>
        </div>
      </div>
    </header>
  );
}