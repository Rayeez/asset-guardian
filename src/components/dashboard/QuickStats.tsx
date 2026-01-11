import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, TrendingDown, Building } from 'lucide-react';

interface QuickStatsProps {
  assignedAssets: number;
  unassignedAssets: number;
  totalAssetValue: number;
  totalDepreciation: number;
  ownedCount: number;
  leasedCount: number;
}

const formatCurrency = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value}`;
};

export function QuickStats({
  assignedAssets,
  unassignedAssets,
  totalAssetValue,
  totalDepreciation,
  ownedCount,
  leasedCount,
}: QuickStatsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Quick Insights</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs">Assignment</span>
          </div>
          <div className="text-lg font-semibold text-primary">{assignedAssets}</div>
          <div className="text-xs text-muted-foreground">Assigned</div>
          <div className="text-lg font-semibold text-orange-500">{unassignedAssets}</div>
          <div className="text-xs text-muted-foreground">Unassigned</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building className="h-4 w-4" />
            <span className="text-xs">Ownership</span>
          </div>
          <div className="text-lg font-semibold text-primary">{ownedCount}</div>
          <div className="text-xs text-muted-foreground">Owned</div>
          <div className="text-lg font-semibold text-violet-500">{leasedCount}</div>
          <div className="text-xs text-muted-foreground">Leased</div>
        </div>

        <div className="space-y-1 col-span-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span className="text-xs">Total Asset Value</span>
          </div>
          <div className="text-2xl font-bold text-primary">{formatCurrency(totalAssetValue)}</div>
        </div>

        <div className="space-y-1 col-span-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingDown className="h-4 w-4" />
            <span className="text-xs">Total Depreciation</span>
          </div>
          <div className="text-lg font-semibold text-destructive">{formatCurrency(totalDepreciation)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
