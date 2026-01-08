import { Asset } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WarrantyAlertsProps {
  assets: Asset[];
}

export function WarrantyAlerts({ assets }: WarrantyAlertsProps) {
  const expiringAssets = assets.filter(a => a.warrantyStatus === 'Expiring Soon');
  const expiredAssets = assets.filter(a => a.warrantyStatus === 'Expired');

  const allAlerts = [
    ...expiredAssets.map(a => ({ ...a, alertType: 'expired' as const })),
    ...expiringAssets.map(a => ({ ...a, alertType: 'expiring' as const })),
  ].slice(0, 5);

  return (
    <Card className="card-interactive">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Warranty Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No warranty alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allAlerts.map((asset) => (
              <div
                key={asset.id}
                className={cn(
                  'p-3 rounded-lg border flex items-start gap-3',
                  asset.alertType === 'expired'
                    ? 'bg-destructive/5 border-destructive/20'
                    : 'bg-warning/5 border-warning/20'
                )}
              >
                {asset.alertType === 'expired' ? (
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{asset.assetCode}</p>
                  <p className="text-xs text-muted-foreground">{asset.brand} {asset.model}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-xs',
                        asset.alertType === 'expired' ? 'status-expired' : 'status-expiring'
                      )}
                    >
                      {asset.alertType === 'expired' ? 'Expired' : 'Expiring Soon'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {asset.warrantyEndDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
