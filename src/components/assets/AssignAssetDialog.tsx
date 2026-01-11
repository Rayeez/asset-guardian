import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, isValid } from 'date-fns';
import { CalendarIcon, Loader2, UserPlus, UserMinus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Asset, Employee } from '@/types';
import { mockEmployees, mockDropdownOptions } from '@/data/mockData';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const safeFormatDate = (date: Date | undefined, formatStr: string): string | null => {
  if (!date || !isValid(date)) return null;
  return format(date, formatStr);
};

const assignmentSchema = z.object({
  employeeId: z.string().optional(),
  primaryLocation: z.string().min(1, 'Location is required'),
  userDepartment: z.string().min(1, 'User department is required'),
  subFunction: z.string().optional(),
  assignedDate: z.date().optional(),
  physicallyVerified: z.date().optional(),
  assetRemark: z.string().optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface AssignAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  onSubmit: (data: Partial<Asset>) => void;
}

export function AssignAssetDialog({
  open,
  onOpenChange,
  asset,
  onSubmit,
}: AssignAssetDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      employeeId: '',
      primaryLocation: '',
      userDepartment: '',
      subFunction: '',
      assetRemark: '',
    },
  });

  const getDropdownOptions = (category: string) => {
    return mockDropdownOptions
      .filter((opt) => opt.category === category)
      .map((opt) => opt.value);
  };

  useEffect(() => {
    if (open && asset) {
      form.reset({
        employeeId: asset.employeeId || '',
        primaryLocation: asset.primaryLocation || '',
        userDepartment: asset.userDepartment || '',
        subFunction: asset.subFunction || '',
        assignedDate: asset.assignedDate ? new Date(asset.assignedDate) : undefined,
        physicallyVerified: asset.physicallyVerified ? new Date(asset.physicallyVerified) : undefined,
        assetRemark: asset.assetRemark || '',
      });
      if (asset.employeeId) {
        const emp = mockEmployees.find((e) => e.id === asset.employeeId);
        setSelectedEmployee(emp || null);
      } else {
        setSelectedEmployee(null);
      }
    }
  }, [open, asset, form]);

  const employeeId = form.watch('employeeId');

  useEffect(() => {
    if (employeeId && employeeId !== 'unassigned') {
      const employee = mockEmployees.find((e) => e.id === employeeId);
      if (employee) {
        setSelectedEmployee(employee);
        form.setValue('userDepartment', employee.department);
        form.setValue('subFunction', employee.subFunction || '');
      }
    } else {
      setSelectedEmployee(null);
    }
  }, [employeeId, form]);

  const handleSubmit = async (data: AssignmentFormData) => {
    if (!asset) return;
    
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();

      const updateData: Partial<Asset> = {
        employeeId: data.employeeId && data.employeeId !== 'unassigned' ? data.employeeId : undefined,
        employeeName: selectedEmployee?.displayName,
        employeeEmail: selectedEmployee?.email,
        employeeType: selectedEmployee?.employeeType,
        primaryLocation: data.primaryLocation,
        userDepartment: data.userDepartment,
        subFunction: data.subFunction || undefined,
        assignedDate: data.assignedDate ? format(data.assignedDate, 'yyyy-MM-dd') : undefined,
        physicallyVerified: data.physicallyVerified ? format(data.physicallyVerified, 'yyyy-MM-dd') : undefined,
        assetRemark: data.assetRemark || undefined,
        updatedAt: now,
      };

      await new Promise((resolve) => setTimeout(resolve, 500));
      onSubmit(updateData);
      
      toast({
        title: selectedEmployee ? 'Asset assigned' : 'Asset unassigned',
        description: selectedEmployee 
          ? `Asset ${asset.assetCode} has been assigned to ${selectedEmployee.displayName}.`
          : `Asset ${asset.assetCode} has been unassigned.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnassign = () => {
    form.setValue('employeeId', 'unassigned');
    setSelectedEmployee(null);
  };

  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Asset
          </DialogTitle>
          <DialogDescription>
            Assign or reassign asset <Badge variant="secondary">{asset.assetCode}</Badge> to an employee
          </DialogDescription>
        </DialogHeader>

        {/* Current Assignment Info */}
        {asset.employeeName && (
          <div className="rounded-lg border bg-muted/50 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Currently assigned to</p>
                <p className="font-medium">{asset.employeeName}</p>
                <p className="text-sm text-muted-foreground">{asset.employeeEmail}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleUnassign}>
                <UserMinus className="h-4 w-4 mr-1" />
                Unassign
              </Button>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to Employee</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {mockEmployees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.empNo} - {emp.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedEmployee && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="text-sm font-medium mb-3">Employee Details</h4>
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{' '}
                    <span className="font-medium">{selectedEmployee.displayName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>{' '}
                    <span className="font-medium">{selectedEmployee.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>{' '}
                    <span className="font-medium">{selectedEmployee.employeeType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Department:</span>{' '}
                    <span className="font-medium">{selectedEmployee.department}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="primaryLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Location *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getDropdownOptions('location').map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userDepartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Department *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getDropdownOptions('department').map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subFunction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Function</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub-function" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {getDropdownOptions('subFunction').map((sf) => (
                          <SelectItem key={sf} value={sf}>
                            {sf}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {safeFormatDate(field.value, 'PPP') || <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="physicallyVerified"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physically Verified</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {safeFormatDate(field.value, 'PPP') || <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assetRemark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {selectedEmployee ? 'Assign Asset' : 'Update Assignment'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
