import { format } from 'date-fns';
import { Asset } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface AssetViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
}

const statusVariants: Record<string, string> = {
  Active: 'status-active',
  Inactive: 'status-inactive',
  Reserved: 'status-reserved',
};

const warrantyVariants: Record<string, string> = {
  Active: 'status-active',
  Expired: 'status-expired',
  'Expiring Soon': 'status-expiring',
};

export function AssetViewDialog({ open, onOpenChange, asset }: AssetViewDialogProps) {
  if (!asset) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return format(new Date(dateStr), 'PPP');
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Asset Details</span>
            <Badge variant="outline" className={cn('font-medium', statusVariants[asset.status])}>
              {asset.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Asset Code" value={asset.assetCode} />
              <InfoRow label="Asset Type" value={asset.assetType} />
              <InfoRow label="Department" value={asset.department} />
              <InfoRow label="Action Required" value={asset.action || '—'} />
            </div>
          </section>

          <Separator />

          {/* Hardware Details */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Hardware Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Brand" value={asset.brand} />
              <InfoRow label="Model" value={asset.model} />
              <InfoRow label="Serial Number" value={asset.serialNo} />
              <InfoRow label="Host Name" value={asset.hostName} />
              <InfoRow label="Configuration" value={asset.briefConfig} className="col-span-2" />
            </div>
          </section>

          <Separator />

          {/* Ownership & Purchase */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Ownership & Purchase
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Ownership" value={asset.ownership} />
              <InfoRow label="Vendor" value={asset.purchaseVendor} />
              <InfoRow label="Purchase Date" value={formatDate(asset.dateOfPurchase)} />
              {asset.leaseContractCode && (
                <InfoRow label="Lease Contract" value={asset.leaseContractCode} />
              )}
            </div>
          </section>

          <Separator />

          {/* Warranty Information */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Warranty Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Warranty Type" value={asset.warrantyType} />
              <div>
                <span className="text-sm text-muted-foreground">Warranty Status</span>
                <div className="mt-1">
                  <Badge variant="outline" className={cn('font-medium', warrantyVariants[asset.warrantyStatus])}>
                    {asset.warrantyStatus}
                  </Badge>
                </div>
              </div>
              <InfoRow label="Warranty End" value={formatDate(asset.warrantyEndDate)} />
              {asset.amcStartDate && (
                <InfoRow label="AMC Start" value={formatDate(asset.amcStartDate)} />
              )}
              {asset.amcEndDate && (
                <InfoRow label="AMC End" value={formatDate(asset.amcEndDate)} />
              )}
            </div>
          </section>

          <Separator />

          {/* Assignment Information */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Assignment
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {asset.employeeName ? (
                <>
                  <InfoRow label="Assigned To" value={asset.employeeName} />
                  <InfoRow label="Email" value={asset.employeeEmail || '—'} />
                  <InfoRow label="Employee Type" value={asset.employeeType || '—'} />
                </>
              ) : (
                <InfoRow label="Assigned To" value="Unassigned" className="col-span-2" />
              )}
              <InfoRow label="Location" value={asset.primaryLocation} />
              <InfoRow label="User Department" value={asset.userDepartment} />
              {asset.subFunction && (
                <InfoRow label="Sub-Function" value={asset.subFunction} />
              )}
              {asset.assignedDate && (
                <InfoRow label="Assigned Date" value={formatDate(asset.assignedDate)} />
              )}
              <InfoRow label="Physically Verified" value={formatDate(asset.physicallyVerified)} />
            </div>
          </section>

          {asset.assetRemark && (
            <>
              <Separator />
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Remarks
                </h3>
                <p className="text-sm bg-muted/50 rounded-lg p-3">{asset.assetRemark}</p>
              </section>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <section>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Created: {formatDate(asset.createdAt)}</span>
              <span>Updated: {formatDate(asset.updatedAt)}</span>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ 
  label, 
  value, 
  className 
}: { 
  label: string; 
  value: string; 
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <p className="font-medium">{value}</p>
    </div>
  );
}
