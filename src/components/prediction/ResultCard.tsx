import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AlertCircle, Droplets, Wind, Thermometer } from 'lucide-react';

export function ResultCard({ result }: any) {
  const type = result.disaster_type;
  const bg = type === 'Flood' ? 'border-blue-500' : type === 'Drought' ? 'border-yellow-500' : type === 'Storm' ? 'border-cyan-500' : 'border-green-500';
  return (
    <Card className={`glass-card border-l-8 ${bg}`}>
      <CardHeader><CardTitle>Prediction Result: {type}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg">{result.recommendation}</p>
        <div><h4 className="font-semibold">Recommended Actions:</h4><ul className="list-disc pl-5 mt-1">{result.actions.map((a: string, i: number) => (<li key={i}>{a}</li>))}</ul></div>
      </CardContent>
    </Card>
  );
}