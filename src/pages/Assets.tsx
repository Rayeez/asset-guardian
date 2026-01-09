import { useState, useMemo } from 'react';
import { mockAssets } from '@/data/mockData';
import { Asset } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Download,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Filter,
  X,
  MinusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssetFormDialog } from '@/components/assets/AssetFormDialog';
import { AssetViewDialog } from '@/components/assets/AssetViewDialog';
import { DeleteAssetDialog } from '@/components/assets/DeleteAssetDialog';
import { RemoveAssetDialog } from '@/components/assets/RemoveAssetDialog';

const statusVariants: Record<string, string> = {
  Active: 'status-active',
  Inactive: 'status-inactive',
  Reserved: 'status-reserved',
  Removed: 'status-removed',
};

const warrantyVariants: Record<string, string> = {
  Active: 'status-active',
  Expired: 'status-expired',
  'Expiring Soon': 'status-expiring',
};

export default function Assets() {
  const { hasPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [warrantyFilter, setWarrantyFilter] = useState<string>('all');
  const [assets, setAssets] = useState<Asset[]>(mockAssets);

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const canEdit = hasPermission(['admin']);
  const canDelete = hasPermission(['admin']);

  const handleAddAsset = () => {
    setSelectedAsset(null);
    setFormDialogOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormDialogOpen(true);
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setViewDialogOpen(true);
  };

  const handleDeleteAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setDeleteDialogOpen(true);
  };

  const handleRemoveAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setRemoveDialogOpen(true);
  };

  const handleFormSubmit = (data: Partial<Asset>) => {
    if (selectedAsset) {
      // Update existing asset
      setAssets((prev) =>
        prev.map((a) =>
          a.id === selectedAsset.id ? { ...a, ...data } : a
        )
      );
    } else {
      // Create new asset
      const newAsset: Asset = {
        id: `A${String(assets.length + 1).padStart(3, '0')}`,
        sNo: assets.length + 1,
        ...data,
      } as Asset;
      setAssets((prev) => [...prev, newAsset]);
    }
  };

  const handleDeleteConfirm = (assetId: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  const handleRemoveConfirm = (assetId: string, reason: string) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? {
              ...a,
              status: 'Removed' as const,
              removedDate: new Date().toISOString().split('T')[0],
              removalReason: reason,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : a
      )
    );
  };

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        searchQuery === '' ||
        asset.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      const matchesType = typeFilter === 'all' || asset.assetType === typeFilter;
      const matchesWarranty = warrantyFilter === 'all' || asset.warrantyStatus === warrantyFilter;

      return matchesSearch && matchesStatus && matchesType && matchesWarranty;
    });
  }, [assets, searchQuery, statusFilter, typeFilter, warrantyFilter]);

  const assetTypes = [...new Set(assets.map((a) => a.assetType))];
  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' || warrantyFilter !== 'all';

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setWarrantyFilter('all');
    setSearchQuery('');
  };

  const exportToCSV = () => {
    const headers = ['Asset Code', 'Type', 'Brand', 'Model', 'Status', 'Assigned To', 'Department', 'Warranty Status'];
    const rows = filteredAssets.map((a) => [
      a.assetCode,
      a.assetType,
      a.brand,
      a.model,
      a.status,
      a.employeeName || '',
      a.department,
      a.warrantyStatus,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'assets-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assets</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all IT assets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {canEdit && (
            <Button onClick={handleAddAsset}>
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Reserved">Reserved</SelectItem>
                <SelectItem value="Removed">Removed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {assetTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={warrantyFilter} onValueChange={setWarrantyFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Warranty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warranty</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Asset Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Brand/Model</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center">
                      <div className="text-muted-foreground">
                        No assets found matching your criteria
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset, index) => (
                    <TableRow key={asset.id} className="hover:bg-muted/50">
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {asset.assetCode}
                      </TableCell>
                      <TableCell>{asset.assetType}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{asset.brand}</div>
                          <div className="text-sm text-muted-foreground">
                            {asset.model}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('font-medium', statusVariants[asset.status])}
                        >
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {asset.employeeName ? (
                          <div>
                            <div className="font-medium">{asset.employeeName}</div>
                            <div className="text-sm text-muted-foreground">
                              {asset.employeeEmail}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>{asset.department}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('font-medium', warrantyVariants[asset.warrantyStatus])}
                        >
                          {asset.warrantyStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewAsset(asset)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {canEdit && asset.status !== 'Removed' && (
                              <DropdownMenuItem onClick={() => handleEditAsset(asset)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canEdit && asset.status !== 'Removed' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleRemoveAsset(asset)}
                                  className="text-warning focus:text-warning"
                                >
                                  <MinusCircle className="h-4 w-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </>
                            )}
                            {canDelete && (
                              <DropdownMenuItem 
                                onClick={() => handleDeleteAsset(asset)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {filteredAssets.length > 0 && (
            <div className="p-4 border-t text-sm text-muted-foreground">
              Showing {filteredAssets.length} of {assets.length} assets
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AssetFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        asset={selectedAsset}
        onSubmit={handleFormSubmit}
      />

      <AssetViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        asset={selectedAsset}
      />

      <DeleteAssetDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        asset={selectedAsset}
        onConfirm={handleDeleteConfirm}
      />

      <RemoveAssetDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        asset={selectedAsset}
        onConfirm={handleRemoveConfirm}
      />
    </div>
  );
}
