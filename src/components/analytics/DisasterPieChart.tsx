import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#f59e0b', '#06b6d4', '#10b981', '#8b5cf6', '#f97316'];

function ChartTip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-3 rounded-xl text-xs" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.18)' }}>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.payload.fill || COLORS[i] }} className="font-medium">{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

export function DisasterPieChart({ data }: { data: { disaster_type: string; count: number }[] }) {
  if (!data || data.length === 0) return <p className="text-center text-slate-600 text-xs py-10">No data</p>;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="disaster_type" cx="50%" cy="50%" outerRadius={90} paddingAngle={3}>
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<ChartTip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}