import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

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

export function MonthlyTrendsChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <p className="text-center text-slate-600 text-xs py-10">No trend data</p>;
  const chartData = data.map(item => ({ month: item.month, ...item.counts }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
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
  );
}