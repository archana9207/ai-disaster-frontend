import { TrendingUp, AlertTriangle } from 'lucide-react';

export function StatsCards({ total, mostCommon }: { total: number; mostCommon: string | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="p-4 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(59,130,246,0.1)' }}>
          <TrendingUp className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-2xl font-bold text-blue-400 mb-0.5" style={{ fontFamily: 'Space Grotesk,sans-serif' }}>{total}</div>
        <div className="text-[11px] text-slate-500">Total Predictions</div>
      </div>
      <div className="p-4 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(245,158,11,0.2)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(245,158,11,0.08)' }}>
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
        </div>
        <div className="text-2xl font-bold text-yellow-400 mb-0.5" style={{ fontFamily: 'Space Grotesk,sans-serif' }}>{mostCommon || 'None'}</div>
        <div className="text-[11px] text-slate-500">Most Frequent Risk</div>
      </div>
    </div>
  );
}