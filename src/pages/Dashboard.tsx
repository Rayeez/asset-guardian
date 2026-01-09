import { useMemo, useState } from 'react';
import { mockAssets, calculateDashboardStats } from '@/data/mockData';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AssetsByTypeChart } from '@/components/dashboard/AssetsByTypeChart';
import { AssetsByStatusChart } from '@/components/dashboard/AssetsByStatusChart';
import { RecentAssetsTable } from '@/components/dashboard/RecentAssetsTable';
import { WarrantyAlerts } from '@/components/dashboard/WarrantyAlerts';
import { RemovedAssetsDialog } from '@/components/dashboard/RemovedAssetsDialog';
import { 
  Monitor, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  AlertTriangle, 
  Wrench,
  Trash2
} from 'lucide-react';

export default function Dashboard() {
  const stats = useMemo(() => calculateDashboardStats(mockAssets), []);
  const [removedDialogOpen, setRemovedDialogOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your IT assets and key metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        <StatsCard
          title="Total Assets"
          value={stats.totalAssets}
          icon={Monitor}
          variant="primary"
        />
        <StatsCard
          title="Active Assets"
          value={stats.activeAssets}
          icon={CheckCircle2}
          variant="success"
        />
        <StatsCard
          title="Inactive Assets"
          value={stats.inactiveAssets}
          icon={XCircle}
          variant="destructive"
        />
        <StatsCard
          title="Removed"
          value={stats.removedAssets}
          icon={Trash2}
          variant="muted"
          onClick={() => setRemovedDialogOpen(true)}
        />
        <StatsCard
          title="Under Warranty"
          value={stats.underWarranty}
          icon={Shield}
          variant="info"
        />
        <StatsCard
          title="Expiring Soon"
          value={stats.expiringWarranty}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatsCard
          title="Requires Action"
          value={stats.requiresAction}
          icon={Wrench}
          variant="destructive"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <AssetsByTypeChart data={stats.assetsByType} />
        <AssetsByStatusChart data={stats.assetsByStatus} />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentAssetsTable assets={mockAssets.filter(a => a.status !== 'Removed').slice(0, 5)} />
        </div>
        <div>
          <WarrantyAlerts assets={mockAssets.filter(a => a.status !== 'Removed')} />
        </div>
      </div>

      {/* Removed Assets Dialog */}
      <RemovedAssetsDialog
        open={removedDialogOpen}
        onOpenChange={setRemovedDialogOpen}
        assets={mockAssets}
      />
    </div>
  );
}
