import { useState } from 'react';
import { Asset } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface RemoveAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  onConfirm: (assetId: string, reason: string) => void;
}

export function RemoveAssetDialog({
  open,
  onOpenChange,
  asset,
  onConfirm,
}: RemoveAssetDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (asset && reason.trim()) {
      onConfirm(asset.id, reason.trim());
      setReason('');
      onOpenChange(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setReason('');
    }
    onOpenChange(isOpen);
  };

  if (!asset) return null;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Asset</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{' '}
            <span className="font-semibold text-foreground">{asset.assetCode}</span>?
            This will mark the asset as removed from active inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="removal-reason" className="text-sm font-medium">
            Reason for Removal <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="removal-reason"
            placeholder="e.g., Asset disposed, sold, lost, damaged beyond repair..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-2"
            rows={3}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove Asset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
