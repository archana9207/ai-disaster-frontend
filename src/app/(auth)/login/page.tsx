'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/src/services/auth';
import { useAuthStore } from '@/src/store/authStore';
import { Activity, Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    try {
      const res = await login({
        username: formData.get('username') as string,
        password: formData.get('password') as string,
      });

      // BUG FIX: original code only did localStorage.setItem and never called
      // setAuth(), so Zustand accessToken stayed null. The dashboard layout
      // guards on accessToken and immediately redirected back to /login.
      // Fix: call setAuth() which persists both user + token via Zustand persist,
      // and also writes to localStorage so the axios interceptor can read it.
      const { access_token, user } = res.data;
      setAuth(user, access_token);
      // Keep raw token in localStorage for the axios request interceptor
      localStorage.setItem('access_token', access_token);

      router.push('/dashboard');
    } catch (err: any) {
      const d = err.response?.data;
      setError(d?.detail || d?.non_field_errors?.[0] || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all';
  const inputStyle = { background: '#162035', border: '1px solid rgba(59,130,246,0.14)' };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#060c1a' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.07),transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.06),transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}
          >
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-white font-bold text-lg"
            style={{ fontFamily: 'Space Grotesk,sans-serif' }}
          >
            DisasterAI
          </span>
        </div>

        <div
          className="p-8 rounded-2xl"
          style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.14)' }}
        >
          <h1
            className="text-2xl font-bold text-white mb-1"
            style={{ fontFamily: 'Space Grotesk,sans-serif' }}
          >
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm mb-7">
            Sign in to access your disaster prediction dashboard
          </p>

          {error && (
            <div
              className="flex items-start gap-2.5 p-3.5 rounded-xl mb-5"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.18)',
              }}
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="text-red-400 text-xs">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  name="username"
                  placeholder="your username"
                  required
                  className={inputBase}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.14)')}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Your password"
                  required
                  className={`${inputBase} pr-11`}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.14)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
                boxShadow: '0 0 24px rgba(59,130,246,0.22)',
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-5">
          AI Disaster Prediction System · Secure Authentication
        </p>
      </div>
    </div>
  );
}