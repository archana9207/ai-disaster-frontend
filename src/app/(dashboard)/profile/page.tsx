'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/src/store/authStore';
import { getSummary } from '@/src/services/analytics';
import api from '@/src/services/api';
import {
  User, Mail, Lock, Shield, LogOut, Eye, EyeOff,
  CheckCircle2, AlertCircle, BarChart2, Zap, AlertTriangle,
  Calendar, Edit3, Save, X, Trash2, Activity,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Small reusable helpers
───────────────────────────────────────────── */
function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`p-6 rounded-2xl ${className}`}
      style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, label, color = '#3b82f6' }: { icon: React.ElementType; label: string; color?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{label}</h2>
    </div>
  );
}

function InputField({
  label, name, type = 'text', value, onChange, icon: Icon, placeholder = '',
  readOnly = false, suffix, autoComplete,
}: {
  label: string; name: string; type?: string; value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ElementType; placeholder?: string; readOnly?: boolean;
  suffix?: React.ReactNode; autoComplete?: string;
}) {
  const base: React.CSSProperties = {
    background: readOnly ? 'rgba(255,255,255,0.02)' : '#162035',
    border: `1px solid ${readOnly ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.14)'}`,
    color: readOnly ? '#64748b' : '#e2e8f0',
  };
  return (
    <div>
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
        <input
          type={type} name={name} value={value} readOnly={readOnly}
          onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
          style={base}
          onFocus={e => { if (!readOnly) e.target.style.borderColor = '#3b82f6'; }}
          onBlur={e => { if (!readOnly) e.target.style.borderColor = 'rgba(59,130,246,0.14)'; }}
        />
        {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
    </div>
  );
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  const isSuccess = type === 'success';
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-2"
      style={{
        background: isSuccess ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
        border: `1px solid ${isSuccess ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}`,
        color: isSuccess ? '#34d399' : '#f87171',
      }}
    >
      {isSuccess
        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      {message}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function ProfilePage() {
  const { user, logout, setAuth } = useAuthStore();

  // ── Account info state ──
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // ── Password state ──
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // ── Stats state ──
  const [stats, setStats] = useState<{ total: number; mostCommon: string | null; uniqueTypes: number } | null>(null);

  // ── Danger zone ──
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Sync user from store when available
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Load stats
  useEffect(() => {
    getSummary()
      .then(res => {
        const d = res.data;
        setStats({
          total: d.total_predictions ?? 0,
          mostCommon: d.most_common_disaster ?? null,
          uniqueTypes: (d.disaster_breakdown ?? []).length,
        });
      })
      .catch(() => setStats({ total: 0, mostCommon: null, uniqueTypes: 0 }));
  }, []);

  // ── Handlers ──
  const handleCancelEdit = () => {
    setUsername(user?.username || '');
    setEmail(user?.email || '');
    setEditing(false);
    setInfoMsg(null);
  };

  const handleSaveInfo = async () => {
    if (!username.trim()) {
      setInfoMsg({ text: 'Username cannot be empty.', type: 'error' });
      return;
    }
    setInfoLoading(true);
    setInfoMsg(null);
    try {
      const res = await api.patch('/users/me/', { username: username.trim(), email: email.trim() });
      // Update store with new user data; keep the existing token
      const token = localStorage.getItem('access_token') || '';
      setAuth(res.data, token);
      setInfoMsg({ text: 'Profile updated successfully.', type: 'success' });
      setEditing(false);
    } catch (err: any) {
      const d = err.response?.data;
      const msg = d?.username?.[0] || d?.email?.[0] || d?.detail || 'Failed to update profile.';
      setInfoMsg({ text: msg, type: 'error' });
    } finally {
      setInfoLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassMsg({ text: 'All password fields are required.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    if (newPassword.length < 8) {
      setPassMsg({ text: 'Password must be at least 8 characters.', type: 'error' });
      return;
    }
    setPassLoading(true);
    setPassMsg(null);
    try {
      await api.post('/users/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPassMsg({ text: 'Password changed successfully.', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const d = err.response?.data;
      const msg = d?.current_password?.[0] || d?.new_password?.[0] || d?.detail || 'Failed to change password.';
      setPassMsg({ text: msg, type: 'error' });
    } finally {
      setPassLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.username) return;
    setDeleteLoading(true);
    try {
      await api.delete('/users/me/');
      logout();
    } catch (err: any) {
      setDeleteLoading(false);
    }
  };

  const avatarLetter = (user?.username || user?.email || 'U')[0].toUpperCase();
  const joinDate = user?.date_joined
    ? new Date(user.date_joined).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  const STAT_ITEMS = [
    { label: 'Total Predictions', value: stats?.total ?? '—', icon: BarChart2, color: '#3b82f6', border: 'rgba(59,130,246,0.2)', bg: 'rgba(59,130,246,0.08)' },
    { label: 'Most Common Risk', value: stats?.mostCommon ?? '—', icon: AlertTriangle, color: '#f59e0b', border: 'rgba(245,158,11,0.2)', bg: 'rgba(245,158,11,0.06)' },
    { label: 'Unique Disaster Types', value: stats?.uniqueTypes ?? '—', icon: Zap, color: '#8b5cf6', border: 'rgba(139,92,246,0.2)', bg: 'rgba(139,92,246,0.06)' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">

      {/* ── Page header ── */}
      <div className="pt-2">
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          My Profile
        </h1>
        <p className="text-slate-500 text-xs mt-1">Manage your account details and preferences</p>
      </div>

      {/* ── Hero card ── */}
      <SectionCard>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white select-none"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', boxShadow: '0 0 32px rgba(59,130,246,0.3)' }}
            >
              {avatarLetter}
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: '#10b981', border: '2px solid #0c1528' }}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {user?.username || 'User'}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                Disaster Analyst
              </span>
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                Active
              </span>
              {joinDate && (
                <span className="flex items-center gap-1 text-[11px] text-slate-600">
                  <Calendar className="w-3 h-3" /> Joined {joinDate}
                </span>
              )}
            </div>
          </div>

          {/* Edit toggle */}
          <button
            onClick={() => (editing ? handleCancelEdit() : setEditing(true))}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
            style={editing
              ? { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }
              : { background: 'rgba(59,130,246,0.1)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            {editing ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Edit3 className="w-3.5 h-3.5" /> Edit Profile</>}
          </button>
        </div>
      </SectionCard>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STAT_ITEMS.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-4 rounded-2xl" style={{ background: '#0c1528', border: `1px solid ${s.border}` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
                <Icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif', color: s.color }}>
                {stats === null ? (
                  <span className="inline-block w-10 h-6 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                ) : s.value}
              </div>
              <div className="text-[11px] text-slate-500">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* ── Account information ── */}
      <SectionCard>
        <SectionTitle icon={User} label="Account Information" />

        <div className="space-y-4">
          <InputField
            label="Username"
            name="username"
            icon={User}
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="your_username"
            readOnly={!editing}
            autoComplete="username"
          />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            readOnly={!editing}
            autoComplete="email"
          />
        </div>

        {infoMsg && <div className="mt-4"><Toast message={infoMsg.text} type={infoMsg.type} /></div>}

        {editing && (
          <div className="flex gap-2 mt-5">
            <button
              onClick={handleSaveInfo}
              disabled={infoLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', boxShadow: '0 0 20px rgba(59,130,246,0.2)' }}
            >
              {infoLoading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-4 h-4" />}
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-all"
              style={{ border: '1px solid rgba(59,130,246,0.12)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        )}
      </SectionCard>

      {/* ── Change password ── */}
      <SectionCard>
        <SectionTitle icon={Lock} label="Change Password" color="#8b5cf6" />

        <div className="space-y-4">
          {/* Current password */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Your current password"
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                style={{ background: '#162035', border: '1px solid rgba(59,130,246,0.14)' }}
                onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
                onBlur={e => (e.target.style.borderColor = 'rgba(59,130,246,0.14)')}
              />
              <button type="button" onClick={() => setShowCurrent(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">New Password</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                style={{ background: '#162035', border: '1px solid rgba(59,130,246,0.14)' }}
                onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
                onBlur={e => (e.target.style.borderColor = 'rgba(59,130,246,0.14)')}
              />
              <button type="button" onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Strength bar */}
            {newPassword.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map(i => {
                    const strength = Math.min(4, Math.floor(newPassword.length / 3));
                    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
                    return (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all"
                        style={{ background: i <= strength ? colors[strength - 1] : 'rgba(255,255,255,0.06)' }} />
                    );
                  })}
                </div>
                <span className="text-[10px] text-slate-600">
                  {newPassword.length < 4 ? 'Weak' : newPassword.length < 8 ? 'Fair' : newPassword.length < 12 ? 'Good' : 'Strong'}
                </span>
              </div>
            )}
          </div>

          {/* Confirm */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                style={{
                  background: '#162035',
                  border: confirmPassword && confirmPassword !== newPassword
                    ? '1px solid rgba(239,68,68,0.4)'
                    : '1px solid rgba(59,130,246,0.14)',
                }}
                onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
                onBlur={e => {
                  e.target.style.borderColor = confirmPassword && confirmPassword !== newPassword
                    ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.14)';
                }}
              />
              {confirmPassword && confirmPassword === newPassword && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              )}
            </div>
          </div>
        </div>

        {passMsg && <div className="mt-4"><Toast message={passMsg.text} type={passMsg.type} /></div>}

        <button
          onClick={handleChangePassword}
          disabled={passLoading}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', boxShadow: '0 0 20px rgba(139,92,246,0.2)' }}
        >
          {passLoading
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Shield className="w-4 h-4" />}
          Update Password
        </button>
      </SectionCard>

      {/* ── Session / quick actions ── */}
      <SectionCard>
        <SectionTitle icon={Activity} label="Session" color="#06b6d4" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-300 font-medium">Current Session</p>
            <p className="text-xs text-slate-600 mt-0.5">You are logged in as <span className="text-slate-400">{user?.username}</span>. Signing out will clear all session data.</p>
          </div>
          <button
            onClick={logout}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.18)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </SectionCard>

      {/* ── Danger zone ── */}
      <div
        className="p-6 rounded-2xl"
        style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)' }}>
            <Trash2 className="w-4 h-4 text-red-400" />
          </div>
          <h2 className="text-sm font-bold text-red-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Danger Zone</h2>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Permanently delete your account and all associated prediction data. This action is <span className="text-red-400 font-medium">irreversible</span>.
          Type your username <span className="text-slate-300 font-mono">{user?.username}</span> below to confirm.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={deleteConfirm}
            onChange={e => setDeleteConfirm(e.target.value)}
            placeholder={`Type "${user?.username}" to confirm`}
            className="flex-1 px-3 py-2.5 rounded-xl text-sm placeholder-slate-700 outline-none transition-all"
            style={{ background: '#162035', border: '1px solid rgba(239,68,68,0.15)', color: '#e2e8f0' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(239,68,68,0.4)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(239,68,68,0.15)')}
          />
          <button
            onClick={handleDeleteAccount}
            disabled={deleteConfirm !== user?.username || deleteLoading}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
            onMouseEnter={e => { if (deleteConfirm === user?.username) e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; }}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
          >
            {deleteLoading
              ? <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
              : <Trash2 className="w-4 h-4" />}
            Delete Account
          </button>
        </div>
      </div>

    </div>
  );
}