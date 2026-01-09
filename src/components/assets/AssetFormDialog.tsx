import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Asset, Employee } from '@/types';
import { mockEmployees, mockDropdownOptions } from '@/data/mockData';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

const assetFormSchema = z.object({
  // Step 1: Basic Info
  assetCode: z.string().min(1, 'Asset code is required'),
  assetType: z.string().min(1, 'Asset type is required'),
  department: z.string().min(1, 'Department is required'),
  status: z.string().min(1, 'Status is required'),
  action: z.string().optional(),

  // Step 2: Hardware Details
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  serialNo: z.string().min(1, 'Serial number is required'),
  hostName: z.string().min(1, 'Host name is required'),
  briefConfig: z.string().min(1, 'Configuration is required'),

  // Step 3: Ownership & Purchase
  ownership: z.string().min(1, 'Ownership type is required'),
  purchaseVendor: z.string().min(1, 'Vendor is required'),
  dateOfPurchase: z.date({ required_error: 'Purchase date is required' }),
  leaseContractCode: z.string().optional(),

  // Step 4: Warranty
  warrantyEndDate: z.date({ required_error: 'Warranty end date is required' }),
  warrantyType: z.string().min(1, 'Warranty type is required'),
  amcStartDate: z.date().optional(),
  amcEndDate: z.date().optional(),

  // Step 5: Assignment
  employeeId: z.string().optional(),
  primaryLocation: z.string().min(1, 'Location is required'),
  userDepartment: z.string().min(1, 'User department is required'),
  subFunction: z.string().optional(),
  assignedDate: z.date().optional(),
  physicallyVerified: z.date().optional(),
  assetRemark: z.string().optional(),
});

type AssetFormData = z.infer<typeof assetFormSchema>;

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: Asset | null;
  onSubmit: (data: Partial<Asset>) => void;
}

const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Asset identification' },
  { id: 2, title: 'Hardware', description: 'Device specifications' },
  { id: 3, title: 'Purchase', description: 'Ownership details' },
  { id: 4, title: 'Warranty', description: 'Warranty & AMC' },
  { id: 5, title: 'Assignment', description: 'Employee & location' },
];

const ASSET_TYPES = [
  'Laptop',
  'Desktop',
  'Printer',
  'Keyboard',
  'Mouse',
  'Headphone',
  'Monitor',
  'Keyboard + Mouse Combo',
];

export function AssetFormDialog({
  open,
  onOpenChange,
  asset,
  onSubmit,
}: AssetFormDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const isEditing = !!asset;

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      assetCode: '',
      assetType: '',
      department: '',
      status: 'Active',
      action: '',
      brand: '',
      model: '',
      serialNo: '',
      hostName: '',
      briefConfig: '',
      ownership: 'Owned',
      purchaseVendor: '',
      leaseContractCode: '',
      warrantyType: 'Warranty',
      employeeId: '',
      primaryLocation: '',
      userDepartment: '',
      subFunction: '',
      assetRemark: '',
    },
  });

  // Reset form when dialog opens/closes or asset changes
  useEffect(() => {
    if (open) {
      setCurrentStep(1);
      if (asset) {
        form.reset({
          assetCode: asset.assetCode,
          assetType: asset.assetType,
          department: asset.department,
          status: asset.status,
          action: asset.action || '',
          brand: asset.brand,
          model: asset.model,
          serialNo: asset.serialNo,
          hostName: asset.hostName,
          briefConfig: asset.briefConfig,
          ownership: asset.ownership,
          purchaseVendor: asset.purchaseVendor,
          dateOfPurchase: new Date(asset.dateOfPurchase),
          leaseContractCode: asset.leaseContractCode || '',
          warrantyEndDate: new Date(asset.warrantyEndDate),
          warrantyType: asset.warrantyType,
          amcStartDate: asset.amcStartDate ? new Date(asset.amcStartDate) : undefined,
          amcEndDate: asset.amcEndDate ? new Date(asset.amcEndDate) : undefined,
          employeeId: asset.employeeId || '',
          primaryLocation: asset.primaryLocation,
          userDepartment: asset.userDepartment,
          subFunction: asset.subFunction || '',
          assignedDate: asset.assignedDate ? new Date(asset.assignedDate) : undefined,
          physicallyVerified: asset.physicallyVerified ? new Date(asset.physicallyVerified) : undefined,
          assetRemark: asset.assetRemark || '',
        });
        if (asset.employeeId) {
          const emp = mockEmployees.find((e) => e.id === asset.employeeId);
          setSelectedEmployee(emp || null);
        }
      } else {
        form.reset();
        setSelectedEmployee(null);
      }
    }
  }, [open, asset, form]);

  // Watch for ownership changes to show/hide lease code
  const ownership = form.watch('ownership');
  const warrantyType = form.watch('warrantyType');
  const employeeId = form.watch('employeeId');

  // Auto-populate employee details
  useEffect(() => {
    if (employeeId) {
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

  const getDropdownOptions = (category: string) => {
    return mockDropdownOptions
      .filter((opt) => opt.category === category)
      .map((opt) => opt.value);
  };

  const validateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate: (keyof AssetFormData)[][] = [
      ['assetCode', 'assetType', 'department', 'status'],
      ['brand', 'model', 'serialNo', 'hostName', 'briefConfig'],
      ['ownership', 'purchaseVendor', 'dateOfPurchase'],
      ['warrantyEndDate', 'warrantyType'],
      ['primaryLocation', 'userDepartment'],
    ];

    const fields = fieldsToValidate[step - 1];
    const result = await form.trigger(fields);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (data: AssetFormData) => {
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const warrantyEndDate = data.warrantyEndDate;
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      let warrantyStatus: 'Active' | 'Expired' | 'Expiring Soon' = 'Active';
      if (warrantyEndDate < today) {
        warrantyStatus = 'Expired';
      } else if (warrantyEndDate <= thirtyDaysFromNow) {
        warrantyStatus = 'Expiring Soon';
      }

      const assetData: Partial<Asset> = {
        assetCode: data.assetCode,
        assetType: data.assetType as Asset['assetType'],
        department: data.department,
        status: data.status as Asset['status'],
        action: data.action && data.action !== 'none' ? data.action : undefined,
        brand: data.brand,
        model: data.model,
        serialNo: data.serialNo,
        hostName: data.hostName,
        briefConfig: data.briefConfig,
        ownership: data.ownership as Asset['ownership'],
        purchaseVendor: data.purchaseVendor,
        dateOfPurchase: format(data.dateOfPurchase, 'yyyy-MM-dd'),
        warrantyEndDate: format(data.warrantyEndDate, 'yyyy-MM-dd'),
        warrantyType: data.warrantyType as Asset['warrantyType'],
        warrantyStatus,
        leaseContractCode: data.ownership === 'Leased' ? data.leaseContractCode : undefined,
        amcStartDate: data.amcStartDate ? format(data.amcStartDate, 'yyyy-MM-dd') : undefined,
        amcEndDate: data.amcEndDate ? format(data.amcEndDate, 'yyyy-MM-dd') : undefined,
        employeeId: data.employeeId || undefined,
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

      if (!isEditing) {
        assetData.createdAt = now;
      }

      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      onSubmit(assetData);
      
      toast({
        title: isEditing ? 'Asset updated' : 'Asset created',
        description: `Asset ${data.assetCode} has been ${isEditing ? 'updated' : 'created'} successfully.`,
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

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                currentStep > step.id
                  ? 'bg-primary border-primary text-primary-foreground'
                  : currentStep === step.id
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-muted-foreground/30 text-muted-foreground'
              )}
            >
              {currentStep > step.id ? (
                <Check className="h-5 w-5" />
              ) : (
                step.id
              )}
            </div>
            <div className="hidden sm:block mt-2 text-center">
              <div className={cn(
                'text-xs font-medium',
                currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {step.title}
              </div>
            </div>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={cn(
                'w-12 sm:w-24 h-0.5 mx-2',
                currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="assetCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Asset Code *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., BTSPL-LPT-001" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="assetType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Asset Type *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ASSET_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Department *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Engineering" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="action"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Action Required</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select action (if any)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {getDropdownOptions('action').map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getDropdownOptions('brand').map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
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
        name="model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Latitude 5520" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="serialNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Serial Number *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., DL5520-001" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hostName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Host Name *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., BTSPL-DEV-001" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="briefConfig"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Brief Configuration *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., i7, 16GB RAM, 512GB SSD" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="ownership"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ownership Type *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select ownership" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Owned">Owned</SelectItem>
                <SelectItem value="Leased">Leased</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="purchaseVendor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Purchase Vendor *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getDropdownOptions('purchaseVendor').map((vendor) => (
                  <SelectItem key={vendor} value={vendor}>
                    {vendor}
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
        name="dateOfPurchase"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Purchase *</FormLabel>
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
                    {field.value ? (
                      format(field.value, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {ownership === 'Leased' && (
        <FormField
          control={form.control}
          name="leaseContractCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lease Contract Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., LC-2024-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="warrantyType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Warranty Type *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Warranty">Warranty</SelectItem>
                <SelectItem value="AMC">AMC</SelectItem>
                <SelectItem value="Non-Warranty">Non-Warranty</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="warrantyEndDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Warranty End Date *</FormLabel>
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
                    {field.value ? (
                      format(field.value, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
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

      {warrantyType === 'AMC' && (
        <>
          <FormField
            control={form.control}
            name="amcStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AMC Start Date</FormLabel>
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
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
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
            name="amcEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AMC End Date</FormLabel>
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
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
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
        </>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      {/* Employee Selection */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Assign to Employee</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
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
      </div>

      {/* Auto-populated Employee Details */}
      {selectedEmployee && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <h4 className="text-sm font-medium mb-3">Employee Details (Auto-populated)</h4>
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
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

      {/* Location Details */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="primaryLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Location *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Bangalore" {...field} />
              </FormControl>
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
              <FormControl>
                <Input placeholder="e.g., Engineering" {...field} />
              </FormControl>
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
              <FormControl>
                <Input placeholder="e.g., Development" {...field} />
              </FormControl>
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
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
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
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
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
                placeholder="Any additional notes about this asset..."
                className="resize-none"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Asset' : 'Add New Asset'}
          </DialogTitle>
        </DialogHeader>

        {renderStepIndicator()}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="min-h-[280px]">
              {renderCurrentStep()}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {currentStep < STEPS.length ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {isEditing ? 'Update Asset' : 'Create Asset'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
