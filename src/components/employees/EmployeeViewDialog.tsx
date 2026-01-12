import { Employee } from '@/types';
import { mockAssets } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserCircle, Mail, Building, Briefcase, Package } from 'lucide-react';

interface EmployeeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function EmployeeViewDialog({
  open,
  onOpenChange,
  employee,
}: EmployeeViewDialogProps) {
  if (!employee) return null;

  const assignedAssets = mockAssets.filter((a) => a.employeeId === employee.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Employee Details
          </DialogTitle>
          <DialogDescription>
            View complete information for {employee.displayName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-semibold text-primary">
                {employee.displayName.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{employee.displayName}</h3>
              <p className="text-sm text-muted-foreground">{employee.empNo}</p>
              <Badge
                variant="outline"
                className={employee.employeeType === 'Permanent' ? 'status-active' : 'status-reserved'}
              >
                {employee.employeeType}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Contact & Department */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
            </div>
            {employee.subFunction && (
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Sub-Function</p>
                  <p className="font-medium">{employee.subFunction}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Assigned Assets */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Assigned Assets ({assignedAssets.length})
            </h4>
            {assignedAssets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assets assigned</p>
            ) : (
              <div className="space-y-2">
                {assignedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{asset.assetCode}</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.assetType} • {asset.brand} {asset.model}
                      </p>
                    </div>
                    <Badge variant="outline" className="status-active">
                      {asset.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
