import { useState, useMemo } from 'react';
import { mockEmployees } from '@/data/mockData';
import { Employee } from '@/types';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const employeeTypeVariants: Record<string, string> = {
  Permanent: 'status-active',
  Contractual: 'status-reserved',
};

export default function Employees() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    empNo: '',
    displayName: '',
    email: '',
    employeeType: 'Permanent' as 'Permanent' | 'Contractual',
    department: '',
    subFunction: '',
  });

  const canEdit = hasPermission(['admin', 'hr']);
  const canDelete = hasPermission(['admin']);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        searchQuery === '' ||
        employee.empNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
      const matchesType = typeFilter === 'all' || employee.employeeType === typeFilter;

      return matchesSearch && matchesDepartment && matchesType;
    });
  }, [employees, searchQuery, departmentFilter, typeFilter]);

  const departments = [...new Set(employees.map((e) => e.department))];
  const hasActiveFilters = departmentFilter !== 'all' || typeFilter !== 'all';

  const clearFilters = () => {
    setDepartmentFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
  };

  const handleAddEmployee = () => {
    if (!newEmployee.empNo || !newEmployee.displayName || !newEmployee.email || !newEmployee.department) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const employee: Employee = {
      id: `E${String(employees.length + 1).padStart(3, '0')}`,
      ...newEmployee,
    };

    setEmployees([...employees, employee]);
    setIsAddDialogOpen(false);
    setNewEmployee({
      empNo: '',
      displayName: '',
      email: '',
      employeeType: 'Permanent',
      department: '',
      subFunction: '',
    });

    toast({
      title: 'Employee Added',
      description: `${employee.displayName} has been added successfully.`,
    });
  };

  const exportToCSV = () => {
    const headers = ['Emp No', 'Name', 'Email', 'Type', 'Department', 'Sub-Function'];
    const rows = filteredEmployees.map((e) => [
      e.empNo,
      e.displayName,
      e.email,
      e.employeeType,
      e.department,
      e.subFunction || '',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage employee records and assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {canEdit && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Fill in the employee details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="empNo">Employee No *</Label>
                      <Input
                        id="empNo"
                        placeholder="BTSPL007"
                        value={newEmployee.empNo}
                        onChange={(e) => setNewEmployee({ ...newEmployee, empNo: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Full Name *</Label>
                      <Input
                        id="displayName"
                        placeholder="John Doe"
                        value={newEmployee.displayName}
                        onChange={(e) => setNewEmployee({ ...newEmployee, displayName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@btspl.com"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeType">Employee Type *</Label>
                      <Select
                        value={newEmployee.employeeType}
                        onValueChange={(value) => setNewEmployee({ ...newEmployee, employeeType: value as 'Permanent' | 'Contractual' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Permanent">Permanent</SelectItem>
                          <SelectItem value="Contractual">Contractual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Input
                        id="department"
                        placeholder="Engineering"
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subFunction">Sub-Function</Label>
                    <Input
                      id="subFunction"
                      placeholder="Development"
                      value={newEmployee.subFunction}
                      onChange={(e) => setNewEmployee({ ...newEmployee, subFunction: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee}>Add Employee</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="stats-gradient-primary text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Employees</p>
                <p className="text-3xl font-bold">{employees.length}</p>
              </div>
              <UserCircle className="h-10 w-10 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="stats-gradient-success text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Permanent</p>
                <p className="text-3xl font-bold">
                  {employees.filter((e) => e.employeeType === 'Permanent').length}
                </p>
              </div>
              <UserCircle className="h-10 w-10 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="stats-gradient-warning text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Contractual</p>
                <p className="text-3xl font-bold">
                  {employees.filter((e) => e.employeeType === 'Contractual').length}
                </p>
              </div>
              <UserCircle className="h-10 w-10 opacity-50" />
            </div>
          </CardContent>
        </Card>
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
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Permanent">Permanent</SelectItem>
                <SelectItem value="Contractual">Contractual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Employee No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Sub-Function</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="text-muted-foreground">
                        No employees found matching your criteria
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee, index) => (
                    <TableRow key={employee.id} className="hover:bg-muted/50">
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {employee.empNo}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {employee.displayName.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          {employee.displayName}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {employee.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('font-medium', employeeTypeVariants[employee.employeeType])}
                        >
                          {employee.employeeType}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {employee.subFunction || '—'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {canEdit && (
                              <DropdownMenuItem>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
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
          {filteredEmployees.length > 0 && (
            <div className="p-4 border-t text-sm text-muted-foreground">
              Showing {filteredEmployees.length} of {employees.length} employees
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
