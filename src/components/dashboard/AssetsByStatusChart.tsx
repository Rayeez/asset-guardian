import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AssetsByStatusChartProps {
  data: { status: string; count: number }[];
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  Active: { bg: 'bg-success/10', text: 'text-success', label: 'Active' },
  Inactive: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Inactive' },
  Reserved: { bg: 'bg-warning/10', text: 'text-warning', label: 'Reserved' },
  Removed: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Removed' },
};

export function AssetsByStatusChart({ data }: AssetsByStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  // Filter out removed from visual display but keep for reference
  const displayData = data.filter(item => item.status !== 'Removed');

  return (
    <Card className="border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Assets by Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayData.map((item) => {
          const config = STATUS_CONFIG[item.status] || { bg: 'bg-muted', text: 'text-muted-foreground', label: item.status };
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

          return (
            <div key={item.status} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{config.label}</span>
                <span className="text-muted-foreground">
                  {item.count} <span className="text-xs">({percentage}%)</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', config.bg, config.text)}
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: item.status === 'Active' ? 'hsl(var(--success))' :
                                    item.status === 'Inactive' ? 'hsl(var(--destructive))' :
                                    item.status === 'Reserved' ? 'hsl(var(--warning))' :
                                    'hsl(var(--muted-foreground))'
                  }}
                />
              </div>
            </div>
          );
        })}

        {displayData.length === 0 && (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No data available
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 pt-4 border-t">
          {displayData.map((item) => {
            const config = STATUS_CONFIG[item.status] || { bg: 'bg-muted', text: 'text-muted-foreground', label: item.status };
            return (
              <div key={item.status} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: item.status === 'Active' ? 'hsl(var(--success))' :
                                    item.status === 'Inactive' ? 'hsl(var(--destructive))' :
                                    item.status === 'Reserved' ? 'hsl(var(--warning))' :
                                    'hsl(var(--muted-foreground))'
                  }}
                />
                <span className="text-xs text-muted-foreground">{config.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
