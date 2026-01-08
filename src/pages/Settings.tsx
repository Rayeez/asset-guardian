import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockDropdownOptions } from '@/data/mockData';
import { DropdownOption, DropdownCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categoryLabels: Record<DropdownCategory, string> = {
  assetCode: 'Asset Codes',
  assetType: 'Asset Types',
  action: 'Actions',
  brand: 'Brands',
  model: 'Models',
  serialNo: 'Serial Numbers',
  hostName: 'Host Names',
  briefConfig: 'Configurations',
  purchaseVendor: 'Purchase Vendors',
};

export default function Settings() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [options, setOptions] = useState<DropdownOption[]>(mockDropdownOptions);
  const [activeTab, setActiveTab] = useState<DropdownCategory>('brand');
  const [newValue, setNewValue] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const canEdit = hasPermission(['admin']);

  if (!canEdit) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">
              You don't have permission to access the settings page.
              Please contact an administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredOptions = options.filter((opt) => opt.category === activeTab);

  const handleAddOption = () => {
    if (!newValue.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a value.',
        variant: 'destructive',
      });
      return;
    }

    const exists = options.some(
      (opt) => opt.category === activeTab && opt.value.toLowerCase() === newValue.toLowerCase()
    );

    if (exists) {
      toast({
        title: 'Duplicate Value',
        description: 'This value already exists in this category.',
        variant: 'destructive',
      });
      return;
    }

    const newOption: DropdownOption = {
      id: `${activeTab}-${Date.now()}`,
      category: activeTab,
      value: newValue.trim(),
    };

    setOptions([...options, newOption]);
    setNewValue('');
    setIsAddDialogOpen(false);

    toast({
      title: 'Option Added',
      description: `"${newValue}" has been added to ${categoryLabels[activeTab]}.`,
    });
  };

  const handleDeleteOption = (id: string) => {
    setOptions(options.filter((opt) => opt.id !== id));
    toast({
      title: 'Option Deleted',
      description: 'The option has been removed.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage dropdown options and system configuration
        </p>
      </div>

      {/* Dropdown Management */}
      <Card>
        <CardHeader>
          <CardTitle>Dropdown Options</CardTitle>
          <CardDescription>
            Manage reusable dropdown values for asset forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DropdownCategory)}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <TabsList className="flex flex-wrap h-auto gap-1">
                {(Object.keys(categoryLabels) as DropdownCategory[]).map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-xs px-3 py-1.5"
                  >
                    {categoryLabels[category]}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Option</DialogTitle>
                    <DialogDescription>
                      Add a new value to {categoryLabels[activeTab]}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="newValue">Value</Label>
                    <Input
                      id="newValue"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Enter value..."
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddOption}>Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {(Object.keys(categoryLabels) as DropdownCategory[]).map((category) => (
              <TabsContent key={category} value={category}>
                <div className="border rounded-lg p-4">
                  {filteredOptions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No options found. Click "Add Option" to create one.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {filteredOptions.map((option) => (
                        <Badge
                          key={option.id}
                          variant="secondary"
                          className="pl-3 pr-1.5 py-1.5 text-sm flex items-center gap-2"
                        >
                          {option.value}
                          <button
                            onClick={() => handleDeleteOption(option.id)}
                            className="p-0.5 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Application Version</p>
              <p className="text-lg font-semibold">1.0.0</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-lg font-semibold">January 8, 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
