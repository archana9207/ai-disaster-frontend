'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { predictDisaster } from '@/src/services/prediction';
import { Thermometer, Droplets, Wind, Gauge, CloudRain, Zap, Info, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FieldCfg {
  key: string;
  label: string;
  icon: React.ElementType;
  unit: string;
  min: number;
  max: number;
  step: number;
  color: string;
  desc: string;
  warnAt: number;
  dangerAt: number;
  invertAlert?: boolean;
  formKey: string;
  defaultValue: number;
}

const FIELDS: FieldCfg[] = [
  { key: 'temp', formKey: 'temperature_celsius', label: 'Temperature', icon: Thermometer, unit: '°C', min: -10, max: 55, step: 0.5, color: '#f59e0b', desc: 'Ambient air temperature', warnAt: 32, dangerAt: 40, defaultValue: 25 },
  { key: 'hum', formKey: 'humidity', label: 'Relative Humidity', icon: Droplets, unit: '%', min: 0, max: 100, step: 1, color: '#06b6d4', desc: 'Water vapour percentage', warnAt: 70, dangerAt: 84, defaultValue: 50 },
  { key: 'rain', formKey: 'precip_mm', label: 'Precipitation', icon: CloudRain, unit: 'mm', min: 0, max: 200, step: 1, color: '#3b82f6', desc: 'Daily precipitation', warnAt: 45, dangerAt: 90, defaultValue: 0 },
  { key: 'wind', formKey: 'wind_kph', label: 'Wind Speed', icon: Wind, unit: 'km/h', min: 0, max: 150, step: 1, color: '#8b5cf6', desc: 'Average wind velocity', warnAt: 45, dangerAt: 75, defaultValue: 10 },
  { key: 'pres', formKey: 'pressure_mb', label: 'Atm. Pressure', icon: Gauge, unit: 'hPa', min: 950, max: 1050, step: 0.5, color: '#10b981', desc: 'Barometric pressure', warnAt: 1000, dangerAt: 985, invertAlert: true, defaultValue: 1013 },
];

const PRESETS = [
  { label: 'Flood', emoji: '🌊', color: '#3b82f6', values: { temperature_celsius: 26, humidity: 91, precip_mm: 160, wind_kph: 38, pressure_mb: 988 } },  // ✅ changed 148 → 160
  { label: 'Storm', emoji: '⛈️', color: '#8b5cf6', values: { temperature_celsius: 23, humidity: 84, precip_mm: 72, wind_kph: 96, pressure_mb: 976 } },
  { label: 'Cyclone', emoji: '🌀', color: '#06b6d4', values: { temperature_celsius: 28, humidity: 85, precip_mm: 150, wind_kph: 120, pressure_mb: 970 } },
  { label: 'Drought', emoji: '☀️', color: '#f59e0b', values: { temperature_celsius: 41, humidity: 19, precip_mm: 2, wind_kph: 22, pressure_mb: 1019 } },
  { label: 'Normal', emoji: '🌤️', color: '#10b981', values: { temperature_celsius: 24, humidity: 56, precip_mm: 12, wind_kph: 18, pressure_mb: 1013 } },
];

const DISASTER_COLORS: Record<string, string> = {
  Flood: '#3b82f6', Storm: '#8b5cf6', Cyclone: '#06b6d4', Drought: '#f59e0b', Normal: '#10b981',
};

function alertLevel(v: number, f: FieldCfg): 'high' | 'medium' | 'normal' {
  if (f.invertAlert) return v < f.dangerAt ? 'high' : v < f.warnAt ? 'medium' : 'normal';
  return v >= f.dangerAt ? 'high' : v >= f.warnAt ? 'medium' : 'normal';
}
function barColor(level: 'high' | 'medium' | 'normal', base: string) {
  return level === 'high' ? '#ef4444' : level === 'medium' ? '#f59e0b' : base;
}

export default function PredictPage() {
  const [values, setValues] = useState<Record<string, number>>({
    temperature_celsius: 25, humidity: 50, precip_mm: 0, wind_kph: 10, pressure_mb: 1013,
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: string, v: number) => setValues(prev => ({ ...prev, [key]: v }));

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setValues(preset.values);
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        temperature_celsius: values.temperature_celsius,
        humidity: values.humidity,
        precip_mm: values.precip_mm,
        wind_kph: values.wind_kph,
        pressure_mb: values.pressure_mb,
      };
      console.log('Sending payload:', payload);
      const res = await predictDisaster(payload);
      console.log('Prediction response:', res.data);
      setResult(res.data);
    } catch (err: any) {
      console.error('Prediction error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend. Make sure the server is running on http://localhost:8000');
      } else {
        setError(err.response?.data?.error || err.response?.data?.detail || `Server error: ${err.response?.status}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const dc = result ? (DISASTER_COLORS[result.disaster_type] || '#3b82f6') : '#3b82f6';

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-5 pt-2">
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk,sans-serif' }}>New Prediction</h1>
        <p className="text-slate-500 text-xs mt-1">Enter environmental parameters to generate an AI-powered disaster risk assessment</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left — inputs */}
        <div className="xl:col-span-2 space-y-4">
          {/* Presets */}
          <div className="p-5 rounded-2xl" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Quick Presets</div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => applyPreset(p)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl text-center transition-all"
                  style={{ background: `${p.color}0e`, border: `1px solid ${p.color}28` }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                  <span className="text-lg leading-none">{p.emoji}</span>
                  <span className="text-[10px] font-medium leading-tight" style={{ color: p.color }}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="p-5 rounded-2xl space-y-5" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Environmental Parameters</div>
              <div className="flex items-center gap-1 text-[11px] text-slate-600">
                <Info className="w-3 h-3" /> Drag sliders or type values
              </div>
            </div>

            {FIELDS.map(field => {
              const Icon = field.icon;
              const val = values[field.formKey] ?? field.defaultValue;
              const pct = ((val - field.min) / (field.max - field.min)) * 100;
              const level = alertLevel(val, field);
              const color = barColor(level, field.color);

              return (
                <div key={field.key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${field.color}14` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: field.color }} />
                      </div>
                      <span className="text-sm font-medium text-slate-200">{field.label}</span>
                      <span className="text-[10px] text-slate-600 hidden sm:inline">— {field.desc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {level !== 'normal' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                          style={{ background: level === 'high' ? 'rgba(239,68,68,0.14)' : 'rgba(245,158,11,0.14)', color: level === 'high' ? '#ef4444' : '#f59e0b' }}>
                          {level}
                        </span>
                      )}
                      <input type="number" min={field.min} max={field.max} step={field.step} value={val}
                        onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= field.min && v <= field.max) set(field.formKey, v); }}
                        className="w-20 text-right text-sm font-bold pr-1 outline-none rounded-lg py-1 px-2"
                        style={{ background: '#162035', border: `1px solid ${color}40`, color }} />
                      <span className="text-xs text-slate-600 w-10">{field.unit}</span>
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full cursor-pointer" style={{ background: 'rgba(59,130,246,0.08)' }}>
                    <div className="absolute top-0 left-0 h-full rounded-full pointer-events-none transition-all"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg,${field.color}70,${color})` }} />
                    <input type="range" min={field.min} max={field.max} step={field.step} value={val}
                      onChange={e => set(field.formKey, parseFloat(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-2" />
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 pointer-events-none transition-all"
                      style={{ left: `calc(${pct}% - 8px)`, borderColor: color, background: '#0c1528', boxShadow: `0 0 6px ${color}60` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-700 mt-1">
                    <span>{field.min} {field.unit}</span>
                    <span>{field.max} {field.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — live preview & result */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl sticky top-20" style={{ background: '#0c1528', border: '1px solid rgba(59,130,246,0.1)' }}>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Parameter Overview</div>
            <div className="space-y-2.5 mb-5">
              {FIELDS.map(f => {
                const val = values[f.formKey] ?? f.defaultValue;
                const level = alertLevel(val, f);
                const color = barColor(level, f.color);
                const pct = ((val - f.min) / (f.max - f.min)) * 100;
                const Icon = f.icon;
                return (
                  <div key={f.key} className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: f.color }} />
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-slate-500">{f.label}</span>
                        <span style={{ color }}>{val} {f.unit}</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(59,130,246,0.08)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={handlePredict} disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', boxShadow: '0 0 24px rgba(59,130,246,0.25)' }}>
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analysing…</>
                : <><Zap className="w-4 h-4" />Run Prediction<ArrowRight className="w-4 h-4 ml-auto" /></>}
            </button>
            <p className="text-center text-[10px] text-slate-600 mt-3">AI model processes environmental features</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-4 rounded-2xl"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="text-red-400 text-xs">{error}</span>
            </div>
          )}

          {result && (
            <div className="p-5 rounded-2xl" style={{ background: '#0c1528', border: `1px solid ${dc}28` }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4" style={{ color: dc }} />
                <span className="text-sm font-bold text-white" style={{ fontFamily: 'Space Grotesk,sans-serif' }}>
                  {result.disaster_type}
                </span>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${dc}18`, color: dc }}>DETECTED</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{result.recommendation}</p>

              {result.actions?.length > 0 && (
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Recommended Actions</div>
                  <ul className="space-y-1">
                    {result.actions.map((action: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: dc }} />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.shap_explanation && (
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Feature Impact (SHAP)</div>
                  <div className="space-y-2">
                    {Object.entries(result.shap_explanation).map(([feature, value]) => (
                      <div key={feature} className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 w-28 truncate">{feature}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(59,130,246,0.1)' }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.abs(Number(value)) * 50)}%`, background: dc }} />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 w-12 text-right">
                          {Number(value) > 0 ? '+' : ''}{Number(value).toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}