'use client';
import { useState } from 'react';
import { Search, Clock } from 'lucide-react';

interface HistoryRecord {
  id: number;
  temperature: number;
  humidity: number;
  precip_mm: number;
  wind_kph: number;
  pressure_mb: number;
  predicted_disaster: string;
  created_at: string;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch { return 'Invalid date'; }
}

const DISASTER_COLORS: Record<string, string> = {
  Flood: '#3b82f6', Drought: '#f59e0b', Storm: '#8b5cf6', Cyclone: '#06b6d4', Normal: '#10b981',
};

export function HistoryTable({ data }: { data: HistoryRecord[] }) {
  const [search, setSearch] = useState('');

  const filtered = (data || []).filter(r =>
    r.predicted_disaster?.toLowerCase().includes(search.toLowerCase())
  );

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14">
        <Clock className="w-7 h-7 text-slate-700 mb-2.5" />
        <p className="text-sm text-slate-600">No predictions yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        <input type="text" placeholder="Filter by disaster type…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xs pl-9 pr-3 py-2 rounded-xl text-xs text-slate-300 placeholder-slate-600 outline-none"
          style={{ background: '#162035', border: '1px solid rgba(59,130,246,0.14)' }}
          onFocus={e => (e.target.style.borderColor = '#3b82f6')}
          onBlur={e => (e.target.style.borderColor = 'rgba(59,130,246,0.14)')} />
      </div>
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.08)' }}>
        <table className="w-full text-xs min-w-175">
          <thead>
            <tr style={{ background: 'rgba(59,130,246,0.03)', borderBottom: '1px solid rgba(59,130,246,0.07)' }}>
              {['Date', 'Temp (°C)', 'Humidity (%)', 'Rain (mm)', 'Wind (km/h)', 'Pressure (mb)', 'Risk'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((record, idx) => {
              const dc = DISASTER_COLORS[record.predicted_disaster] || '#3b82f6';
              return (
                <tr key={record.id}
                  style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(59,130,246,0.05)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-4 py-3 text-slate-400">{formatDate(record.created_at)}</td>
                  <td className="px-4 py-3 text-slate-300">{record.temperature?.toFixed(1)}</td>
                  <td className="px-4 py-3 text-slate-300">{record.humidity}</td>
                  <td className="px-4 py-3 text-slate-300">{record.precip_mm?.toFixed(1)}</td>
                  <td className="px-4 py-3 text-slate-300">{record.wind_kph?.toFixed(1)}</td>
                  <td className="px-4 py-3 text-slate-300">{record.pressure_mb?.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${dc}14`, color: dc }}>{record.predicted_disaster}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length < data.length && (
        <p className="text-[11px] text-slate-600 mt-3 text-center">Showing {filtered.length} of {data.length}</p>
      )}
    </div>
  );
}