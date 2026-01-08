import { Asset } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface RecentAssetsTableProps {
  assets: Asset[];
}

const statusVariants: Record<string, string> = {
  Active: 'status-active',
  Inactive: 'status-inactive',
  Reserved: 'status-reserved',
};

export function RecentAssetsTable({ assets }: RecentAssetsTableProps) {
  return (
    <Card className="card-interactive">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Assets</CardTitle>
        <a href="/dashboard/assets" className="text-sm text-primary hover:underline">
          View all →
        </a>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{asset.assetCode}</TableCell>
                <TableCell>{asset.assetType}</TableCell>
                <TableCell className="text-muted-foreground">
                  {asset.employeeName || '—'}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn('font-medium', statusVariants[asset.status])}
                  >
                    {asset.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
