'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

export function WeatherForm({ onSubmit, loading }: any) {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Temperature (°C)</Label><Input type="number" step="0.1" {...register('temperature_celsius', { required: true })} /></div>
        <div><Label>Humidity (%)</Label><Input type="number" {...register('humidity', { required: true, min: 0, max: 100 })} /></div>
        <div><Label>Precipitation (mm)</Label><Input type="number" step="0.1" {...register('precip_mm', { required: true })} /></div>
        <div><Label>Wind Speed (km/h)</Label><Input type="number" step="0.1" {...register('wind_kph', { required: true })} /></div>
        <div><Label>Pressure (mb)</Label><Input type="number" step="0.1" {...register('pressure_mb', { required: true })} /></div>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Predicting...' : 'Analyze Risk'}</Button>
    </form>
  );
}