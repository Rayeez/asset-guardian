// User and Authentication Types
export type UserRole = 'admin' | 'hr' | 'director';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
}

// Asset Types
export type AssetStatus = 'Active' | 'Inactive' | 'Reserved' | 'Removed';
export type AssetType = 'Laptop' | 'Desktop' | 'Printer' | 'Keyboard' | 'Mouse' | 'Headphone' | 'Monitor' | 'Keyboard + Mouse Combo';
export type OwnershipType = 'Owned' | 'Leased';
export type WarrantyType = 'Warranty' | 'AMC' | 'Non-Warranty';
export type WarrantyStatus = 'Active' | 'Expired' | 'Expiring Soon';

export interface Asset {
  id: string;
  sNo: number;
  assetCode: string;
  assetType: AssetType;
  department: string;
  status: AssetStatus;
  action?: string;
  brand: string;
  model: string;
  serialNo: string;
  hostName: string;
  briefConfig: string;
  ownership: OwnershipType;
  purchaseVendor: string;
  dateOfPurchase: string;
  warrantyEndDate: string;
  warrantyType: WarrantyType;
  amcStartDate?: string;
  amcEndDate?: string;
  warrantyStatus: WarrantyStatus;
  leaseContractCode?: string;
  employeeId?: string;
  employeeName?: string;
  employeeEmail?: string;
  employeeType?: string;
  primaryLocation: string;
  userDepartment: string;
  subFunction?: string;
  assignedDate?: string;
  physicallyVerified?: string;
  assetRemark?: string;
  createdAt: string;
  updatedAt: string;
  removedDate?: string;
  removalReason?: string;
}

// Employee Types
export type EmployeeType = 'Permanent' | 'Contractual';

export interface Employee {
  id: string;
  empNo: string;
  displayName: string;
  email: string;
  employeeType: EmployeeType;
  department: string;
  subFunction?: string;
}

// Dropdown Option Types
export type DropdownCategory = 
  | 'assetCode'
  | 'assetType'
  | 'action'
  | 'brand'
  | 'model'
  | 'serialNo'
  | 'hostName'
  | 'briefConfig'
  | 'purchaseVendor';

export interface DropdownOption {
  id: string;
  category: DropdownCategory;
  value: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalAssets: number;
  activeAssets: number;
  inactiveAssets: number;
  removedAssets: number;
  underWarranty: number;
  expiredWarranty: number;
  expiringWarranty: number;
  requiresAction: number;
  assetsByType: { type: string; count: number }[];
  assetsByDepartment: { department: string; count: number }[];
  assetsByStatus: { status: string; count: number }[];
}
