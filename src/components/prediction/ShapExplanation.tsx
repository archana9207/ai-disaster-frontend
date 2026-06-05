import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export function ShapExplanation({ shap }: { shap: Record<string, number> }) {
  const entries = Object.entries(shap).sort((a,b) => Math.abs(b[1]) - Math.abs(a[1]));
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle>Explainable AI (SHAP) – Feature Impact</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map(([feat, val]) => (
            <div key={feat} className="flex items-center gap-3">
              <span className="w-32 text-sm">{feat}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.abs(val)*50)}%`, transform: val>0 ? 'none' : 'scaleX(-1)' }} />
              </div>
              <span className="text-xs font-mono">{val > 0 ? '+' : ''}{val.toFixed(3)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">Positive values increase disaster risk, negative decrease.</p>
      </CardContent>
    </Card>
  );
}