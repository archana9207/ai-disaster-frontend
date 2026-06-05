'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSummary } from '@/src/services/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Loader2, PlusCircle, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getSummary();
        setSummary(res.data);
      } catch (err: any) {
        console.error('Dashboard error:', err);
        setError(err.response?.data?.detail || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-400 mb-2">{error}</p>
          <button onClick={() => window.location.reload()} className="text-primary underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!summary || summary.total_predictions === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/predict">
            <Button className="gap-2">
              <PlusCircle size={16} /> New Prediction
            </Button>
          </Link>
        </div>
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <Activity size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No predictions yet.</p>
            <Link href="/predict">
              <Button>Make your first prediction</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back – here's your disaster risk overview</p>
        </div>
        <Link href="/predict">
          <Button className="gap-2 shadow-lg">
            <PlusCircle size={16} /> New Prediction
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
            <TrendingUp size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total_predictions}</div>
          </CardContent>
        </Card>
        <Card className="glass-card hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Most Frequent Risk</CardTitle>
            <AlertTriangle size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.most_common_disaster || 'None'}</div>
          </CardContent>
        </Card>
        <Card className="glass-card hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Risk Types</CardTitle>
            <Activity size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.disaster_breakdown?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.recent_predictions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent predictions</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-2">No.</th>
                    <th className="text-left p-2">Temp (°C)</th>
                    <th className="text-left p-2">Rain (mm)</th>
                    <th className="text-left p-2">Wind (km/h)</th>
                    <th className="text-left p-2">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recent_predictions.map((pred: any, idx: number) => (
                    <tr key={pred.id ? `pred-${pred.id}` : `fallback-${idx}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2">{pred.temperature.toFixed(1)}</td>
                      <td className="p-2">{pred.precip_mm.toFixed(1)}</td>
                      <td className="p-2">{pred.wind_kph.toFixed(1)}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pred.predicted_disaster === 'Flood' ? 'bg-blue-500/20 text-blue-300' :
                          pred.predicted_disaster === 'Drought' ? 'bg-yellow-500/20 text-yellow-300' :
                          pred.predicted_disaster === 'Storm' ? 'bg-cyan-500/20 text-cyan-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {pred.predicted_disaster}
                        </span>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 text-right">
            <Link href="/analytics" className="text-sm text-primary hover:underline">
              View full history & analytics →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}