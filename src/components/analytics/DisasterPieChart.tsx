import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#f59e0b', '#06b6d4', '#10b981'];

export function DisasterPieChart({ data }: { data: { disaster_type: string; count: number }[] }) {
  if (!data || data.length === 0) return <p className="text-center text-muted-foreground">No data</p>;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="disaster_type" cx="50%" cy="50%" outerRadius={80} label>
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}