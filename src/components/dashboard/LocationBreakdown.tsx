import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface LocationBreakdownProps {
  data: { location: string; count: number }[];
}

export function LocationBreakdown({ data }: LocationBreakdownProps) {
  const totalAssets = data.reduce((sum, item) => sum + item.count, 0);
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Assets by Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {sortedData.map((item) => {
            const percentage = ((item.count / totalAssets) * 100).toFixed(0);
            return (
              <div
                key={item.location}
                className="p-3 rounded-lg bg-muted/50 border"
              >
                <div className="text-lg font-semibold">{item.count}</div>
                <div className="text-sm text-muted-foreground">{item.location}</div>
                <div className="text-xs text-primary">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
