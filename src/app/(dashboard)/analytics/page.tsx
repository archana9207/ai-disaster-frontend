'use client';
import { useEffect, useState } from 'react';
import { getSummary, getHistory } from '@/src/services/analytics';
import { DisasterPieChart } from '@/src/components/analytics/DisasterPieChart';
import { MonthlyTrendsChart } from '@/src/components/analytics/MonthlyTrendsChart';
import { StatsCards } from '@/src/components/analytics/StatsCards';
import { HistoryTable } from '@/src/components/history/HistoryTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSummary(), getHistory(100)])
      .then(([summaryRes, historyRes]) => {
        setSummary(summaryRes.data);
        setHistory(historyRes.data);
      })
      .catch(err => console.error('Analytics error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!summary) return <div>Failed to load analytics</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Advanced Analytics</h1>
      <StatsCards total={summary.total_predictions} mostCommon={summary.most_common_disaster} />

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList className="glass">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="history">Full History</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader><CardTitle>Disaster Breakdown</CardTitle></CardHeader>
              <CardContent>
                <DisasterPieChart data={summary.disaster_breakdown} />
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader><CardTitle>Monthly Trends (Last 6 Months)</CardTitle></CardHeader>
              <CardContent>
                <MonthlyTrendsChart data={summary.monthly_trends} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="glass-card">
            <CardHeader><CardTitle>Complete Prediction History</CardTitle></CardHeader>
            <CardContent>
              <HistoryTable data={history} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}