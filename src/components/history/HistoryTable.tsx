'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';

function formatDate(dateString: string): string {
  if (!dateString) return 'No date';
  try {
    // 1. Try standard ISO
    let date = new Date(dateString);
    // 2. If invalid and contains space → replace space with 'T'
    if (isNaN(date.getTime()) && dateString.includes(' ')) {
      date = new Date(dateString.replace(' ', 'T'));
    }
    // 3. If still invalid, try manual parse (Python "YYYY-MM-DD HH:MM:SS")
    if (isNaN(date.getTime())) {
      const parts = dateString.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
      if (parts) {
        const [_, year, month, day, hour, minute, second] = parts;
        date = new Date(Date.UTC(
          parseInt(year), parseInt(month) - 1, parseInt(day),
          parseInt(hour), parseInt(minute), parseInt(second)
        ));
      }
    }
    // 4. Final fallback
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return 'Invalid date';
  }
}

export function HistoryTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <p className="text-muted-foreground text-center py-8">No predictions yet.</p>;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead>Date</TableHead>
            <TableHead>Temp (°C)</TableHead>
            <TableHead>Humidity (%)</TableHead>
            <TableHead>Rain (mm)</TableHead>
            <TableHead>Wind (km/h)</TableHead>
            <TableHead>Pressure (mb)</TableHead>
            <TableHead>Risk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => (
            <TableRow key={record.id} className="border-white/5 hover:bg-white/5">
              <TableCell>{formatDate(record.created_at)}</TableCell>
              <TableCell>{record.temperature.toFixed(1)}</TableCell>
              <TableCell>{record.humidity}</TableCell>
              <TableCell>{record.precip_mm.toFixed(1)}</TableCell>
              <TableCell>{record.wind_kph.toFixed(1)}</TableCell>
              <TableCell>{record.pressure_mb.toFixed(1)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  record.predicted_disaster === 'Flood' ? 'bg-blue-500/20 text-blue-300' :
                  record.predicted_disaster === 'Drought' ? 'bg-yellow-500/20 text-yellow-300' :
                  record.predicted_disaster === 'Storm' ? 'bg-cyan-500/20 text-cyan-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {record.predicted_disaster}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}