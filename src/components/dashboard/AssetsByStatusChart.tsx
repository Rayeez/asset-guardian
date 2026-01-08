import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface AssetsByStatusChartProps {
  data: { status: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  Active: 'hsl(142, 76%, 36%)',
  Inactive: 'hsl(0, 84%, 60%)',
  Reserved: 'hsl(38, 92%, 50%)',
};

export function AssetsByStatusChart({ data }: AssetsByStatusChartProps) {
  return (
    <Card className="card-interactive">
      <CardHeader>
        <CardTitle className="text-lg">Assets by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" axisLine={false} tickLine={false} />
              <YAxis 
                type="category" 
                dataKey="status" 
                axisLine={false} 
                tickLine={false}
                width={80}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [`${value} assets`, 'Count']}
              />
              <Bar 
                dataKey="count" 
                radius={[0, 4, 4, 0]}
                barSize={32}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.status] || 'hsl(var(--primary))'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
