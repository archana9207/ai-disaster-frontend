import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export function MonthlyTrendsChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <p className="text-center text-muted-foreground">No trend data</p>;
  const chartData = data.map(item => ({
    month: item.month,
    ...item.counts,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
        <Legend />
        <Line type="monotone" dataKey="Flood" stroke="#3b82f6" />
        <Line type="monotone" dataKey="Drought" stroke="#f59e0b" />
        <Line type="monotone" dataKey="Storm" stroke="#06b6d4" />
        <Line type="monotone" dataKey="Normal" stroke="#10b981" />
      </LineChart>
    </ResponsiveContainer>
  );
}