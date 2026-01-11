import { User, Asset, Employee, DropdownOption, DashboardStats } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  { id: '1', username: 'admin1', displayName: 'John Admin', email: 'admin1@btspl.com', role: 'admin' },
  { id: '2', username: 'admin2', displayName: 'Jane Admin', email: 'admin2@btspl.com', role: 'admin' },
  { id: '3', username: 'hr1', displayName: 'Sarah HR', email: 'hr@btspl.com', role: 'hr' },
  { id: '4', username: 'director1', displayName: 'Mike Director', email: 'director@btspl.com', role: 'director' },
];

// Mock Employees
export const mockEmployees: Employee[] = [
  { id: 'E001', empNo: 'BTSPL001', displayName: 'Rahul Sharma', email: 'rahul.sharma@btspl.com', employeeType: 'Permanent', department: 'Engineering', subFunction: 'Development' },
  { id: 'E002', empNo: 'BTSPL002', displayName: 'Priya Patel', email: 'priya.patel@btspl.com', employeeType: 'Permanent', department: 'HR', subFunction: 'Recruitment' },
  { id: 'E003', empNo: 'BTSPL003', displayName: 'Amit Kumar', email: 'amit.kumar@btspl.com', employeeType: 'Contractual', department: 'IT', subFunction: 'Support' },
  { id: 'E004', empNo: 'BTSPL004', displayName: 'Sneha Reddy', email: 'sneha.reddy@btspl.com', employeeType: 'Permanent', department: 'Finance', subFunction: 'Accounts' },
  { id: 'E005', empNo: 'BTSPL005', displayName: 'Vikram Singh', email: 'vikram.singh@btspl.com', employeeType: 'Permanent', department: 'Engineering', subFunction: 'QA' },
  { id: 'E006', empNo: 'BTSPL006', displayName: 'Anita Desai', email: 'anita.desai@btspl.com', employeeType: 'Contractual', department: 'Marketing', subFunction: 'Digital' },
];

// Mock Assets
export const mockAssets: Asset[] = [
  {
    id: 'A001',
    sNo: 1,
    assetCode: 'BTSPL-LPT-001',
    assetType: 'Laptop',
    department: 'Engineering',
    status: 'Active',
    brand: 'Dell',
    model: 'Latitude 5520',
    serialNo: 'DL5520-001',
    hostName: 'BTSPL-DEV-001',
    briefConfig: 'i7, 16GB RAM, 512GB SSD',
    ownership: 'Owned',
    purchaseVendor: 'Dell India',
    dateOfPurchase: '2023-06-15',
    purchasePrice: 95000,
    currentValue: 76000,
    depreciationRate: 20,
    warrantyEndDate: '2026-06-15',
    warrantyType: 'Warranty',
    warrantyStatus: 'Active',
    employeeId: 'E001',
    employeeName: 'Rahul Sharma',
    employeeEmail: 'rahul.sharma@btspl.com',
    employeeType: 'Permanent',
    primaryLocation: 'Bangalore',
    userDepartment: 'Engineering',
    subFunction: 'Development',
    assignedDate: '2023-06-20',
    physicallyVerified: '2024-12-01',
    createdAt: '2023-06-15',
    updatedAt: '2024-12-01',
  },
  {
    id: 'A002',
    sNo: 2,
    assetCode: 'BTSPL-LPT-002',
    assetType: 'Laptop',
    department: 'HR',
    status: 'Active',
    brand: 'HP',
    model: 'EliteBook 840',
    serialNo: 'HP840-002',
    hostName: 'BTSPL-HR-001',
    briefConfig: 'i5, 8GB RAM, 256GB SSD',
    ownership: 'Owned',
    purchaseVendor: 'HP India',
    dateOfPurchase: '2022-03-10',
    purchasePrice: 75000,
    currentValue: 45000,
    depreciationRate: 20,
    warrantyEndDate: '2025-03-10',
    warrantyType: 'Warranty',
    warrantyStatus: 'Expiring Soon',
    employeeId: 'E002',
    employeeName: 'Priya Patel',
    employeeEmail: 'priya.patel@btspl.com',
    employeeType: 'Permanent',
    primaryLocation: 'Mumbai',
    userDepartment: 'HR',
    subFunction: 'Recruitment',
    assignedDate: '2022-03-15',
    physicallyVerified: '2024-11-15',
    createdAt: '2022-03-10',
    updatedAt: '2024-11-15',
  },
  {
    id: 'A003',
    sNo: 3,
    assetCode: 'BTSPL-DSK-001',
    assetType: 'Desktop',
    department: 'IT',
    status: 'Active',
    action: 'Upgrade Required',
    brand: 'Lenovo',
    model: 'ThinkCentre M920',
    serialNo: 'LEN920-003',
    hostName: 'BTSPL-IT-001',
    briefConfig: 'i5, 8GB RAM, 1TB HDD',
    ownership: 'Owned',
    purchaseVendor: 'Lenovo India',
    dateOfPurchase: '2021-01-20',
    purchasePrice: 55000,
    currentValue: 22000,
    depreciationRate: 20,
    warrantyEndDate: '2024-01-20',
    warrantyType: 'AMC',
    amcStartDate: '2024-01-21',
    amcEndDate: '2025-01-20',
    warrantyStatus: 'Active',
    employeeId: 'E003',
    employeeName: 'Amit Kumar',
    employeeEmail: 'amit.kumar@btspl.com',
    employeeType: 'Contractual',
    primaryLocation: 'Bangalore',
    userDepartment: 'IT',
    subFunction: 'Support',
    assignedDate: '2021-02-01',
    physicallyVerified: '2024-10-20',
    createdAt: '2021-01-20',
    updatedAt: '2024-10-20',
  },
  {
    id: 'A004',
    sNo: 4,
    assetCode: 'BTSPL-MON-001',
    assetType: 'Monitor',
    department: 'Finance',
    status: 'Active',
    brand: 'Samsung',
    model: '27" LED',
    serialNo: 'SAM27-004',
    hostName: 'N/A',
    briefConfig: '27 inch, Full HD, IPS',
    ownership: 'Owned',
    purchaseVendor: 'Amazon Business',
    dateOfPurchase: '2023-09-05',
    purchasePrice: 18000,
    currentValue: 14400,
    depreciationRate: 20,
    warrantyEndDate: '2026-09-05',
    warrantyType: 'Warranty',
    warrantyStatus: 'Active',
    employeeId: 'E004',
    employeeName: 'Sneha Reddy',
    employeeEmail: 'sneha.reddy@btspl.com',
    employeeType: 'Permanent',
    primaryLocation: 'Hyderabad',
    userDepartment: 'Finance',
    subFunction: 'Accounts',
    assignedDate: '2023-09-10',
    physicallyVerified: '2024-12-05',
    createdAt: '2023-09-05',
    updatedAt: '2024-12-05',
  },
  {
    id: 'A005',
    sNo: 5,
    assetCode: 'BTSPL-LPT-003',
    assetType: 'Laptop',
    department: 'Engineering',
    status: 'Inactive',
    action: 'Repair',
    brand: 'Dell',
    model: 'Inspiron 15',
    serialNo: 'DLI15-005',
    hostName: 'BTSPL-DEV-002',
    briefConfig: 'i5, 8GB RAM, 256GB SSD',
    ownership: 'Leased',
    purchaseVendor: 'Dell India',
    dateOfPurchase: '2020-08-12',
    purchasePrice: 65000,
    currentValue: 13000,
    depreciationRate: 20,
    warrantyEndDate: '2023-08-12',
    warrantyType: 'Non-Warranty',
    warrantyStatus: 'Expired',
    leaseContractCode: 'LC-2020-001',
    primaryLocation: 'Bangalore',
    userDepartment: 'Engineering',
    subFunction: 'QA',
    physicallyVerified: '2024-09-01',
    assetRemark: 'Screen damaged, sent for repair',
    createdAt: '2020-08-12',
    updatedAt: '2024-09-01',
  },
  {
    id: 'A006',
    sNo: 6,
    assetCode: 'BTSPL-PRN-001',
    assetType: 'Printer',
    department: 'Admin',
    status: 'Active',
    brand: 'Canon',
    model: 'imageCLASS MF244dw',
    serialNo: 'CAN244-006',
    hostName: 'BTSPL-PRN-001',
    briefConfig: 'All-in-one Laser Printer',
    ownership: 'Owned',
    purchaseVendor: 'Canon India',
    dateOfPurchase: '2022-11-30',
    purchasePrice: 28000,
    currentValue: 16800,
    depreciationRate: 20,
    warrantyEndDate: '2024-11-30',
    warrantyType: 'AMC',
    amcStartDate: '2024-12-01',
    amcEndDate: '2025-11-30',
    warrantyStatus: 'Active',
    primaryLocation: 'Mumbai',
    userDepartment: 'Admin',
    physicallyVerified: '2024-12-01',
    createdAt: '2022-11-30',
    updatedAt: '2024-12-01',
  },
  {
    id: 'A007',
    sNo: 7,
    assetCode: 'BTSPL-KBM-001',
    assetType: 'Keyboard + Mouse Combo',
    department: 'Marketing',
    status: 'Reserved',
    brand: 'Logitech',
    model: 'MK270',
    serialNo: 'LOG270-007',
    hostName: 'N/A',
    briefConfig: 'Wireless Keyboard + Mouse',
    ownership: 'Owned',
    purchaseVendor: 'Flipkart Business',
    dateOfPurchase: '2024-01-10',
    purchasePrice: 2500,
    currentValue: 2000,
    depreciationRate: 20,
    warrantyEndDate: '2025-01-10',
    warrantyType: 'Warranty',
    warrantyStatus: 'Expiring Soon',
    primaryLocation: 'Delhi',
    userDepartment: 'Marketing',
    physicallyVerified: '2024-11-20',
    assetRemark: 'Reserved for new joinee',
    createdAt: '2024-01-10',
    updatedAt: '2024-11-20',
  },
  {
    id: 'A008',
    sNo: 8,
    assetCode: 'BTSPL-HDP-001',
    assetType: 'Headphone',
    department: 'Engineering',
    status: 'Active',
    brand: 'Jabra',
    model: 'Evolve2 75',
    serialNo: 'JAB75-008',
    hostName: 'N/A',
    briefConfig: 'Wireless, ANC, UC Certified',
    ownership: 'Owned',
    purchaseVendor: 'Amazon Business',
    dateOfPurchase: '2024-06-20',
    purchasePrice: 32000,
    currentValue: 28800,
    depreciationRate: 10,
    warrantyEndDate: '2026-06-20',
    warrantyType: 'Warranty',
    warrantyStatus: 'Active',
    employeeId: 'E005',
    employeeName: 'Vikram Singh',
    employeeEmail: 'vikram.singh@btspl.com',
    employeeType: 'Permanent',
    primaryLocation: 'Bangalore',
    userDepartment: 'Engineering',
    subFunction: 'QA',
    assignedDate: '2024-06-22',
    physicallyVerified: '2024-12-05',
    createdAt: '2024-06-20',
    updatedAt: '2024-12-05',
  },
];

// Calculate Dashboard Stats
export const calculateDashboardStats = (assets: Asset[]): DashboardStats => {
  const activeAssets = assets.filter(a => a.status === 'Active');
  const inactiveAssets = assets.filter(a => a.status === 'Inactive');
  const removedAssets = assets.filter(a => a.status === 'Removed');
  const reservedAssets = assets.filter(a => a.status === 'Reserved');
  const nonRemovedAssets = assets.filter(a => a.status !== 'Removed');
  
  const totalAssetValue = nonRemovedAssets.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  const totalPurchaseValue = nonRemovedAssets.reduce((sum, a) => sum + (a.purchasePrice || 0), 0);
  const totalDepreciation = totalPurchaseValue - totalAssetValue;
  
  const assignedAssets = nonRemovedAssets.filter(a => a.employeeId).length;
  const unassignedAssets = nonRemovedAssets.filter(a => !a.employeeId).length;

  const assetsByType = Object.entries(
    nonRemovedAssets.reduce((acc, asset) => {
      if (!acc[asset.assetType]) {
        acc[asset.assetType] = { count: 0, value: 0 };
      }
      acc[asset.assetType].count += 1;
      acc[asset.assetType].value += asset.currentValue || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>)
  ).map(([type, data]) => ({ type, count: data.count, value: data.value }));

  const assetsByDepartment = Object.entries(
    nonRemovedAssets.reduce((acc, asset) => {
      if (!acc[asset.department]) {
        acc[asset.department] = { count: 0, value: 0 };
      }
      acc[asset.department].count += 1;
      acc[asset.department].value += asset.currentValue || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>)
  ).map(([department, data]) => ({ department, count: data.count, value: data.value }));

  const assetsByStatus = Object.entries(
    assets.reduce((acc, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({ status, count }));

  const assetsByOwnership = Object.entries(
    nonRemovedAssets.reduce((acc, asset) => {
      acc[asset.ownership] = (acc[asset.ownership] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([ownership, count]) => ({ ownership, count }));

  const assetsByLocation = Object.entries(
    nonRemovedAssets.reduce((acc, asset) => {
      acc[asset.primaryLocation] = (acc[asset.primaryLocation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([location, count]) => ({ location, count }));

  return {
    totalAssets: nonRemovedAssets.length,
    activeAssets: activeAssets.length,
    inactiveAssets: inactiveAssets.length,
    removedAssets: removedAssets.length,
    reservedAssets: reservedAssets.length,
    underWarranty: nonRemovedAssets.filter(a => a.warrantyStatus === 'Active').length,
    expiredWarranty: nonRemovedAssets.filter(a => a.warrantyStatus === 'Expired').length,
    expiringWarranty: nonRemovedAssets.filter(a => a.warrantyStatus === 'Expiring Soon').length,
    requiresAction: nonRemovedAssets.filter(a => a.action).length,
    assignedAssets,
    unassignedAssets,
    totalAssetValue,
    totalDepreciation,
    assetsByType,
    assetsByDepartment,
    assetsByStatus,
    assetsByOwnership,
    assetsByLocation,
  };
};

// Dropdown Options
export const mockDropdownOptions: DropdownOption[] = [
  // Asset Codes (prefixes)
  { id: 'ac1', category: 'assetCode', value: 'BTSPL-LPT' },
  { id: 'ac2', category: 'assetCode', value: 'BTSPL-DSK' },
  { id: 'ac3', category: 'assetCode', value: 'BTSPL-MON' },
  { id: 'ac4', category: 'assetCode', value: 'BTSPL-PRN' },
  { id: 'ac5', category: 'assetCode', value: 'BTSPL-KBM' },
  { id: 'ac6', category: 'assetCode', value: 'BTSPL-HDP' },
  
  // Asset Types
  { id: 'at1', category: 'assetType', value: 'Laptop' },
  { id: 'at2', category: 'assetType', value: 'Desktop' },
  { id: 'at3', category: 'assetType', value: 'Monitor' },
  { id: 'at4', category: 'assetType', value: 'Printer' },
  { id: 'at5', category: 'assetType', value: 'Keyboard' },
  { id: 'at6', category: 'assetType', value: 'Mouse' },
  { id: 'at7', category: 'assetType', value: 'Headphone' },
  { id: 'at8', category: 'assetType', value: 'Keyboard + Mouse Combo' },
  
  // Brands
  { id: 'b1', category: 'brand', value: 'Dell' },
  { id: 'b2', category: 'brand', value: 'HP' },
  { id: 'b3', category: 'brand', value: 'Lenovo' },
  { id: 'b4', category: 'brand', value: 'Samsung' },
  { id: 'b5', category: 'brand', value: 'Canon' },
  { id: 'b6', category: 'brand', value: 'Logitech' },
  { id: 'b7', category: 'brand', value: 'Jabra' },
  { id: 'b8', category: 'brand', value: 'Apple' },
  { id: 'b9', category: 'brand', value: 'Asus' },
  { id: 'b10', category: 'brand', value: 'Acer' },
  
  // Models
  { id: 'm1', category: 'model', value: 'Latitude 5520' },
  { id: 'm2', category: 'model', value: 'EliteBook 840' },
  { id: 'm3', category: 'model', value: 'ThinkCentre M920' },
  { id: 'm4', category: 'model', value: 'Inspiron 15' },
  { id: 'm5', category: 'model', value: 'MacBook Pro 14' },
  { id: 'm6', category: 'model', value: 'ThinkPad X1 Carbon' },
  
  // Vendors
  { id: 'v1', category: 'purchaseVendor', value: 'Dell India' },
  { id: 'v2', category: 'purchaseVendor', value: 'HP India' },
  { id: 'v3', category: 'purchaseVendor', value: 'Lenovo India' },
  { id: 'v4', category: 'purchaseVendor', value: 'Amazon Business' },
  { id: 'v5', category: 'purchaseVendor', value: 'Flipkart Business' },
  { id: 'v6', category: 'purchaseVendor', value: 'Canon India' },
  { id: 'v7', category: 'purchaseVendor', value: 'Ingram Micro' },
  
  // Actions
  { id: 'a1', category: 'action', value: 'Repair' },
  { id: 'a2', category: 'action', value: 'Replace' },
  { id: 'a3', category: 'action', value: 'Upgrade Required' },
  { id: 'a4', category: 'action', value: 'Dispose' },
  { id: 'a5', category: 'action', value: 'Return to Vendor' },
  { id: 'a6', category: 'action', value: 'Under Maintenance' },
  
  // Departments
  { id: 'd1', category: 'department', value: 'Engineering' },
  { id: 'd2', category: 'department', value: 'HR' },
  { id: 'd3', category: 'department', value: 'IT' },
  { id: 'd4', category: 'department', value: 'Finance' },
  { id: 'd5', category: 'department', value: 'Admin' },
  { id: 'd6', category: 'department', value: 'Marketing' },
  { id: 'd7', category: 'department', value: 'Sales' },
  { id: 'd8', category: 'department', value: 'Operations' },
  
  // Locations
  { id: 'l1', category: 'location', value: 'Bangalore' },
  { id: 'l2', category: 'location', value: 'Mumbai' },
  { id: 'l3', category: 'location', value: 'Hyderabad' },
  { id: 'l4', category: 'location', value: 'Delhi' },
  { id: 'l5', category: 'location', value: 'Chennai' },
  { id: 'l6', category: 'location', value: 'Pune' },
  
  // Sub Functions
  { id: 'sf1', category: 'subFunction', value: 'Development' },
  { id: 'sf2', category: 'subFunction', value: 'QA' },
  { id: 'sf3', category: 'subFunction', value: 'DevOps' },
  { id: 'sf4', category: 'subFunction', value: 'Support' },
  { id: 'sf5', category: 'subFunction', value: 'Recruitment' },
  { id: 'sf6', category: 'subFunction', value: 'Accounts' },
  { id: 'sf7', category: 'subFunction', value: 'Digital' },
  { id: 'sf8', category: 'subFunction', value: 'Payroll' },
];
