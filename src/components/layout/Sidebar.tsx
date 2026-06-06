'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Zap, History, BarChart3,
  LogOut, Activity, UserCircle,
} from 'lucide-react';
import { useAuthStore } from '@/src/store/authStore';

const NAV = [
  { name: 'Dashboard',      href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Prediction', href: '/predict',   icon: Zap, badge: 'AI' },
  { name: 'History',        href: '/history',   icon: History },
  { name: 'Analytics',      href: '/analytics', icon: BarChart3 },
  { name: 'Profile',        href: '/profile',   icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  return (
    <aside
      className="w-60 h-screen fixed top-0 left-0 z-40 flex-col hidden lg:flex select-none"
      style={{ background: '#070e1f', borderRight: '1px solid rgba(59,130,246,0.1)' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm" style={{ fontFamily: 'Space Grotesk,sans-serif', letterSpacing: '-0.01em' }}>
            DisasterAI
          </div>
          <div className="text-[10px]" style={{ color: '#475569' }}>Prediction System v2.0</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, name, icon: Icon, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group"
              style={{
                background: active ? 'rgba(59,130,246,0.14)' : 'transparent',
                border: active ? '1px solid rgba(59,130,246,0.22)' : '1px solid transparent',
              }}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${active ? '' : 'group-hover:bg-blue-500/10'}`}
                style={{ background: active ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.04)' }}
              >
                <Icon className={`w-4 h-4 transition-colors ${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'}`} />
              </div>
              <span className={`flex-1 text-sm font-medium transition-colors ${active ? 'text-blue-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {name}
              </span>
              {badge && !active && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 space-y-2" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
        {user && (
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 group transition-all"
            style={{ background: 'rgba(255,255,255,0.03)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.07)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
            >
              {(user.username || user.email || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                {user.username || user.email}
              </div>
              <div className="text-[10px] text-blue-400/60 group-hover:text-blue-400 transition-colors">
                View profile →
              </div>
            </div>
          </Link>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-slate-500 hover:text-red-400"
          style={{ background: 'transparent' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}