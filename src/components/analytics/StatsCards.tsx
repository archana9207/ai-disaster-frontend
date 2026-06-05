import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export function StatsCards({ total, mostCommon }: { total: number; mostCommon: string | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
          <TrendingUp size={16} className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Most Frequent Risk</CardTitle>
          <AlertTriangle size={16} className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mostCommon || 'None'}</div>
        </CardContent>
      </Card>
    </div>
  );
}