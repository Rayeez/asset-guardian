import { Asset } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface RemovedAssetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: Asset[];
}

export function RemovedAssetsDialog({
  open,
  onOpenChange,
  assets,
}: RemovedAssetsDialogProps) {
  const removedAssets = assets.filter((a) => a.status === 'Removed');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return 'N/A';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Removed Assets
            <Badge variant="secondary" className="ml-2">
              {removedAssets.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          {removedAssets.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No removed assets found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Brand/Model</TableHead>
                  <TableHead>Removed Date</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {removedAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.assetCode}</TableCell>
                    <TableCell>{asset.assetType}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{asset.brand}</div>
                        <div className="text-sm text-muted-foreground">{asset.model}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(asset.removedDate)}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="line-clamp-2 text-sm text-muted-foreground">
                        {asset.removalReason || 'No reason provided'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
