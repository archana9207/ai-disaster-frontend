'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSummary } from '@/src/services/analytics';
import {
  Loader2, PlusCircle, TrendingUp, AlertTriangle, Activity,
  BarChart2, ShieldAlert, Zap, History, ArrowRight, Clock
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DISASTER_COLORS: Record<string, string> = {
  Flood: '#3b82f6',
  Drought: '#f59e0b',
  Storm: '#8b5cf6',
  Cyclone: '#06b6d4',
  Normal: '#10b981',
};

// (Date formatter kept but not used in recent predictions – kept for other potential uses)
function formatDate(dateString: string): string {
  if (!dateString) return 'No date';
  const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [_, year, month, day] = match;
    const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {}
  return 'Invalid date';
}

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-3 rounded-xl text-xs" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.18)' }}>
      <div className="text-slate-400 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSummary()
      .then(res => setSummary(res.data))
      .catch(err => setError(err.response?.data?.detail || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-8 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 mb-3 text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="text-xs text-blue-400 hover:underline">Retry</button>
        </div>
      </div>
    );
  }

  const total = summary?.total_predictions ?? 0;
  const breakdown: { disaster_type: string; count: number }[] = summary?.disaster_breakdown ?? [];
  const recent: any[] = summary?.recent_predictions ?? [];
  const mostCommon = summary?.most_common_disaster ?? 'None';

  const typeData = breakdown.map(b => ({ name: b.disaster_type, value: b.count }));
  const pieData = breakdown.slice(0, 5).map(b => ({
    name: b.disaster_type,
    value: b.count,
    color: DISASTER_COLORS[b.disaster_type] || '#3b82f6',
  }));

  const trendData = [...recent].slice(0, 7).reverse().map((p: any, i: number) => ({
    label: `P${i + 1}`,
    'Predictions': 1,
  }));

  const monthlyData = (summary?.monthly_trends ?? []).map((m: any) => ({
    month: m.month,
    ...m.counts,
  }));

  const STAT_CARDS = [
    { label: 'Total Predictions', value: total, icon: BarChart2, color: '#3b82f6', border: 'rgba(59,130,246,0.2)', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Most Common', value: mostCommon, icon: ShieldAlert, color: '#ef4444', border: 'rgba(239,68,68,0.2)', bg: 'rgba(239,68,68,0.08)' },
    { label: 'Unique Types', value: breakdown.length, icon: AlertTriangle, color: '#f59e0b', border: 'rgba(245,158,11,0.2)', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Recent (Last 5)', value: recent.length, icon: TrendingUp, color: '#10b981', border: 'rgba(16,185,129,0.2)', bg: 'rgba(16,185,129,0.08)' },
  ];

  const empty = total === 0;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk,sans-serif' }}>Dashboard 👋</h1>
          <p className="text-slate-500 text-xs mt-1">Disaster risk intelligence overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/history" className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-all" style={{ border: '1px solid rgba(59,130,246,0.15)', background: 'rgba(59,130,246,0.04)' }}>
            <History className="w-3.5 h-3.5" /> History
          </Link>
          <Link href="/predict" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>
            <Zap className="w-3.5 h-3.5" /> New Prediction
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAT_CARDS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-4 rounded-2xl" style={{ background: '#0c1528', border: `1px solid ${s.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: 'Space Grotesk,sans-serif', color: s.color }}>
                {s.value}
              </div>
              <div className="text-[11px] text-slate-500">{s.label}</div>
            </div>
          );
        })}
      </div>

      {empty ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
          <Activity className="w-10 h-10 text-slate-700 mb-4" />
          <p className="text-slate-500 text-sm mb-4">No predictions yet. Get started!</p>
          <Link href="/predict" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>
            <Zap className="w-4 h-4" /> Make your first prediction
          </Link>
        </div>
      ) : (
        <>
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-5 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold text-white">Monthly Prediction Trends</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Activity over recent months</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart data={monthlyData.length ? monthlyData : trendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gFlood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gStorm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey={monthlyData.length ? 'month' : 'label'} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  {monthlyData.length ? (
                    <>
                      <Area type="monotone" dataKey="Flood" stroke="#3b82f6" strokeWidth={2} fill="url(#gFlood)" dot={false} />
                      <Area type="monotone" dataKey="Storm" stroke="#8b5cf6" strokeWidth={2} fill="url(#gStorm)" dot={false} />
                      <Area type="monotone" dataKey="Cyclone" stroke="#06b6d4" strokeWidth={2} fill="none" dot={false} />
                      <Area type="monotone" dataKey="Drought" stroke="#f59e0b" strokeWidth={2} fill="none" dot={false} />
                      <Area type="monotone" dataKey="Normal" stroke="#10b981" strokeWidth={2} fill="none" dot={false} />
                    </>
                  ) : (
                    <Area type="monotone" dataKey="Predictions" stroke="#3b82f6" strokeWidth={2} fill="url(#gFlood)" dot={false} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-5 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
              <div className="text-sm font-semibold text-white mb-0.5">Risk Distribution</div>
              <div className="text-[11px] text-slate-500 mb-3">By disaster type</div>
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={36} outerRadius={58} paddingAngle={4} dataKey="value">
                        {pieData.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
                      </Pie>
                      <Tooltip content={<ChartTip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {pieData.map(d => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />{d.name}
                        </span>
                        <span className="font-semibold text-slate-300">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-36 text-xs text-slate-600">No data yet</div>
              )}
            </div>
          </div>

          {/* Bar chart */}
          {typeData.length > 0 && (
            <div className="p-5 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
              <div className="text-sm font-semibold text-white mb-0.5">Predictions by Disaster Type</div>
              <div className="text-[11px] text-slate-500 mb-4">Distribution across all recorded predictions</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={typeData} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="value" name="Count" radius={[5, 5, 0, 0]}>
                    {typeData.map((d, i) => <Cell key={i} fill={DISASTER_COLORS[d.name] || '#3b82f6'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent predictions – DATE REMOVED */}
          <div className="p-5 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-white">Recent Predictions</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Your latest activity</div>
              </div>
              <Link href="/history" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {recent.map((pred: any, idx: number) => {
                const dc = DISASTER_COLORS[pred.predicted_disaster] || '#3b82f6';
                return (
                  <div key={pred.id ?? idx} className="flex items-center gap-3 p-3 rounded-xl transition-colors" style={{ border: '1px solid rgba(59,130,246,0.06)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${dc}16` }}>
                      <Activity className="w-4 h-4" style={{ color: dc }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-slate-200">{pred.predicted_disaster}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${dc}20`, color: dc }}>RISK</span>
                      </div>
                      {/* ✅ Date line completely removed – only weather parameters shown */}
                      <div className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                        {pred.temperature?.toFixed(1)}°C · {pred.precip_mm?.toFixed(1)}mm · {pred.wind_kph?.toFixed(1)}km/h
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 shrink-0">{pred.pressure_mb?.toFixed(0)} hPa</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
        {[
          { href: '/predict', icon: Zap, title: 'New Prediction', desc: 'Enter environmental parameters for AI risk analysis', grad: 'rgba(59,130,246,0.12),rgba(6,182,212,0.12)', border: 'rgba(59,130,246,0.2)', iconColor: '#3b82f6', arrowColor: 'text-blue-400' },
          { href: '/analytics', icon: TrendingUp, title: 'View Analytics', desc: 'Explore your complete prediction history and trends', grad: 'rgba(139,92,246,0.12),rgba(59,130,246,0.12)', border: 'rgba(139,92,246,0.2)', iconColor: '#8b5cf6', arrowColor: 'text-purple-400' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-4 p-4 rounded-2xl group transition-all"
              style={{ background: `linear-gradient(135deg,${item.grad})`, border: `1px solid ${item.border}` }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.01)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.iconColor}20` }}>
                <Icon className="w-5 h-5" style={{ color: item.iconColor }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{item.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
              </div>
              <ArrowRight className={`w-4 h-4 ${item.arrowColor} transition-transform group-hover:translate-x-0.5`} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}