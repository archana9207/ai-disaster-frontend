'use client';
import { useEffect, useState } from 'react';
import { getSummary, getHistory } from '@/src/services/analytics';
import { Loader2, BarChart2, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { HistoryTable } from '@/src/components/history/HistoryTable';

const DISASTER_COLORS: Record<string, string> = {
  Flood: '#3b82f6', Drought: '#f59e0b', Storm: '#8b5cf6',
  Cyclone: '#06b6d4', Landslide: '#f97316', Normal: '#10b981',
};
const COLOR_ARR = ['#3b82f6', '#f59e0b', '#06b6d4', '#10b981', '#8b5cf6', '#f97316'];

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-3 rounded-xl text-xs" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.18)' }}>
      <div className="text-slate-400 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color || p.fill || '#93c5fd' }} className="font-medium">{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'charts' | 'history'>('charts');

  useEffect(() => {
    Promise.all([getSummary(), getHistory(100)])
      .then(([sumRes, histRes]) => {
        setSummary(sumRes.data);
        setHistory(histRes.data);
      })
      .catch(err => console.error('Analytics error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  const total: number = summary.total_predictions ?? 0;
  const mostCommon: string = summary.most_common_disaster ?? 'None';
  const breakdown: { disaster_type: string; count: number }[] = summary.disaster_breakdown ?? [];
  const monthly: any[] = summary.monthly_trends ?? [];

  const pieData = breakdown.map((b, i) => ({
    name: b.disaster_type,
    value: b.count,
    color: DISASTER_COLORS[b.disaster_type] || COLOR_ARR[i % COLOR_ARR.length],
  }));

  const barData = breakdown.map(b => ({ name: b.disaster_type, count: b.count }));
  const monthlyData = monthly.map(m => ({ month: m.month, ...m.counts }));

  const STATS = [
    { label: 'Total Predictions', value: total, icon: BarChart2, color: '#3b82f6', border: 'rgba(59,130,246,0.2)', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Most Common', value: mostCommon, icon: AlertTriangle, color: '#f59e0b', border: 'rgba(245,158,11,0.2)', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Unique Types', value: breakdown.length, icon: Activity, color: '#8b5cf6', border: 'rgba(139,92,246,0.2)', bg: 'rgba(139,92,246,0.08)' },
    { label: 'History Records', value: history.length, icon: TrendingUp, color: '#10b981', border: 'rgba(16,185,129,0.2)', bg: 'rgba(16,185,129,0.08)' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk,sans-serif' }}>Advanced Analytics</h1>
        <p className="text-slate-500 text-xs mt-1">Comprehensive disaster prediction intelligence</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-4 rounded-2xl" style={{ background: '#0c1528', border: `1px solid ${s.border}` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
                <Icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: 'Space Grotesk,sans-serif', color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-slate-500">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl w-fit" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
        {(['charts', 'history'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize"
            style={activeTab === tab
              ? { background: 'rgba(59,130,246,0.2)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }
              : { color: '#64748b', border: '1px solid transparent' }}>
            {tab === 'charts' ? 'Charts' : 'Full History'}
          </button>
        ))}
      </div>

      {activeTab === 'charts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pie chart */}
            <div className="p-5 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
              <div className="text-sm font-semibold text-white mb-0.5">Disaster Breakdown</div>
              <div className="text-[11px] text-slate-500 mb-4">By occurrence count</div>
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                        {pieData.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
                      </Pie>
                      <Tooltip content={<ChartTip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {pieData.map(d => (
                      <div key={d.name} className="flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                        <span className="text-slate-400 truncate">{d.name}</span>
                        <span className="ml-auto font-semibold text-slate-300">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <div className="flex items-center justify-center h-40 text-xs text-slate-600">No data</div>}
            </div>

            {/* Bar chart */}
            <div className="p-5 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
              <div className="text-sm font-semibold text-white mb-0.5">Prediction Count by Type</div>
              <div className="text-[11px] text-slate-500 mb-4">Distribution across disaster categories</div>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData} barSize={24} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
                      {barData.map((d, i) => (
                        <Cell key={i} fill={DISASTER_COLORS[d.name] || COLOR_ARR[i % COLOR_ARR.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="flex items-center justify-center h-40 text-xs text-slate-600">No data</div>}
            </div>
          </div>

          {/* Monthly trends */}
          <div className="p-5 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
            <div className="text-sm font-semibold text-white mb-0.5">Monthly Trends (Last 6 Months)</div>
            <div className="text-[11px] text-slate-500 mb-4">Prediction frequency over time</div>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.06)" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="Flood" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Drought" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Storm" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Normal" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Cyclone" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="flex items-center justify-center h-40 text-xs text-slate-600">No trend data available</div>}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-5 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
          <div className="text-sm font-semibold text-white mb-0.5">Complete Prediction History</div>
          <div className="text-[11px] text-slate-500 mb-4">{history.length} total records</div>
          <HistoryTable data={history} />
        </div>
      )}
    </div>
  );
}