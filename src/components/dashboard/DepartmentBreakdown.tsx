import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DepartmentBreakdownProps {
  data: { department: string; count: number; value: number }[];
}

const formatCurrency = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value}`;
};

export function DepartmentBreakdown({ data }: DepartmentBreakdownProps) {
  const maxCount = Math.max(...data.map((d) => d.count));
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Assets by Department</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedData.map((item) => (
          <div key={item.department} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.department}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{item.count} assets</span>
                <span className="font-medium text-primary">{formatCurrency(item.value)}</span>
              </div>
            </div>
            <Progress value={(item.count / maxCount) * 100} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
