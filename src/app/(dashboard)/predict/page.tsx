'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { predictDisaster } from '@/src/services/prediction';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export default function PredictPage() {
  const { register, handleSubmit, reset } = useForm();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorDetail(null);

    // Convert to numbers
    const payload = {
      temperature_celsius: parseFloat(data.temperature_celsius),
      humidity: parseInt(data.humidity, 10),
      precip_mm: parseFloat(data.precip_mm),
      wind_kph: parseFloat(data.wind_kph),
      pressure_mb: parseFloat(data.pressure_mb),
    };

    // Log the request for debugging
    console.log('Sending prediction request:', payload);

    try {
      const res = await predictDisaster(payload);
      console.log('Prediction response:', res.data);
      setResult(res.data);
    } catch (err: any) {
      console.error('Prediction error full:', err);
      // Check if it's a network error
      if (err.code === 'ERR_NETWORK') {
        setErrorDetail('Cannot connect to backend. Make sure the server is running on http://localhost:8000');
      } else if (err.response) {
        const errorResponse = err.response.data;
        if (errorResponse?.details) {
          const messages = Object.values(errorResponse.details).flat().join(', ');
          setErrorDetail(messages);
        } else if (errorResponse?.error) {
          setErrorDetail(errorResponse.error);
        } else if (errorResponse?.detail) {
          setErrorDetail(errorResponse.detail);
        } else {
          setErrorDetail(`Server error: ${err.response.status}`);
        }
      } else {
        setErrorDetail(err.message || 'Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Real‑time Disaster Risk Prediction</h1>
      <Card className="glass-card">
        <CardHeader><CardTitle>Weather Parameters</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Temperature (°C)</Label>
                <Input type="number" step="0.1" defaultValue="25" {...register('temperature_celsius', { required: true })} />
              </div>
              <div>
                <Label>Humidity (%)</Label>
                <Input type="number" defaultValue="50" {...register('humidity', { required: true, min: 0, max: 100 })} />
              </div>
              <div>
                <Label>Precipitation (mm)</Label>
                <Input type="number" step="0.1" defaultValue="0" {...register('precip_mm', { required: true })} />
              </div>
              <div>
                <Label>Wind Speed (km/h)</Label>
                <Input type="number" step="0.1" defaultValue="10" {...register('wind_kph', { required: true })} />
              </div>
              <div>
                <Label>Pressure (mb)</Label>
                <Input type="number" step="0.1" defaultValue="1013" {...register('pressure_mb', { required: true })} />
              </div>
            </div>
            {errorDetail && (
              <div className="bg-red-500/20 border border-red-500 rounded p-3 text-red-300 text-sm">
                <strong>Error:</strong> {errorDetail}
              </div>
            )}
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? 'Predicting...' : 'Analyze Risk'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { reset(); setResult(null); setErrorDetail(null); }}>
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className={`glass-card border-l-8 ${
          result.disaster_type === 'Flood' ? 'border-blue-500' :
          result.disaster_type === 'Drought' ? 'border-yellow-500' :
          result.disaster_type === 'Storm' ? 'border-cyan-500' : 'border-green-500'
        }`}>
          <CardHeader>
            <CardTitle>Prediction Result: {result.disaster_type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{result.recommendation}</p>
            <div>
              <h4 className="font-semibold">Recommended Actions:</h4>
              <ul className="list-disc pl-5 mt-1">
                {result.actions.map((action: string, idx: number) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>
            {result.shap_explanation && (
              <div>
                <h4 className="font-semibold">Feature Impact (SHAP)</h4>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {Object.entries(result.shap_explanation).map(([feature, value]) => (
                    <div key={feature} className="flex items-center gap-3">
                      <span className="w-32 text-sm">{feature}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(100, Math.abs(Number(value)) * 50)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono">
                        {Number(value) > 0 ? '+' : ''}{Number(value).toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}