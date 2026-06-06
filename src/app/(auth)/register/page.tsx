'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/src/services/auth';
import { Activity, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm_password') as string;

    if (password !== confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register({
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password,
      });
      // Show brief success state then redirect to login
      setSuccess(true);
      setTimeout(() => router.push('/login?registered=true'), 1200);
    } catch (err: any) {
      const d = err.response?.data;
      setError(
        d?.detail ||
        d?.username?.[0] ||
        d?.email?.[0] ||
        d?.password?.[0] ||
        'Registration failed. Please check your input.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all';
  const inputStyle = { background: '#162035', border: '1px solid rgba(59,130,246,0.14)' };
  const focus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = '#3b82f6');
  const blur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = 'rgba(59,130,246,0.14)');

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#060c1a' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.07),transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.06),transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
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
            Create Account
          </h1>
          <p className="text-slate-500 text-sm mb-7">
            Join the AI disaster prediction platform
          </p>

          {/* Success banner */}
          {success && (
            <div
              className="flex items-center gap-2.5 p-3.5 rounded-xl mb-5"
              style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.18)',
              }}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-emerald-400 text-xs">Account created! Redirecting to login…</span>
            </div>
          )}

          {/* Error banner */}
          {error && !success && (
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
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  name="username"
                  placeholder="your_username"
                  required
                  className={inputBase}
                  style={inputStyle}
                  onFocus={focus}
                  onBlur={blur}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className={inputBase}
                  style={inputStyle}
                  onFocus={focus}
                  onBlur={blur}
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
                  placeholder="Create password"
                  required
                  minLength={8}
                  className={`${inputBase} pr-11`}
                  style={inputStyle}
                  onFocus={focus}
                  onBlur={blur}
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

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="password"
                  name="confirm_password"
                  placeholder="Repeat password"
                  required
                  className={inputBase}
                  style={inputStyle}
                  onFocus={focus}
                  onBlur={blur}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
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
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}