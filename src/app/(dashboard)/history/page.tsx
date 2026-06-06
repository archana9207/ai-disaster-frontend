'use client';
import { useEffect, useState } from 'react';
import { getHistory } from '@/src/services/analytics';
import { HistoryTable } from '@/src/components/history/HistoryTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHistory(100)
      .then(res => setHistory(res.data))
      .catch(err => setError(err.response?.data?.detail || 'Failed to load history'))
      .finally(() => setLoading(false));
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
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk,sans-serif' }}>Prediction History</h1>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <HistoryTable data={history} />
        </CardContent>
      </Card>
    </div>
  );
}