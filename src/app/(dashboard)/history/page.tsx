'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';

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
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return 'Invalid date';
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
           ', ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Invalid date';
  }
}

export function HistoryTable({ data }: { data: HistoryRecord[] }) {
  const getBadgeColor = (disaster: string) => {
    switch (disaster) {
      case 'Flood': return 'bg-blue-500/20 text-blue-300';
      case 'Drought': return 'bg-yellow-500/20 text-yellow-300';
      case 'Storm': return 'bg-cyan-500/20 text-cyan-300';
      default: return 'bg-green-500/20 text-green-300';
    }
  };

  if (!data || data.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No predictions yet.</p>;
  }

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
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(record.predicted_disaster)}`}>
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