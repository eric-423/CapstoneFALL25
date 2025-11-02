// Mock Branches data matching BranchDTO from Backend
// BranchDTO fields: id, name, address, phone, isParent, isActive
export const MOCK_BRANCHES = [
  {
    id: 1,
    name: "Chi nhánh Quận 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "0281234567",
    isParent: true,
    isActive: true,
    // Legacy fields for compatibility
    status: "ACTIVE",
    managerId: 2,
  },
  {
    id: 2,
    name: "Chi nhánh Quận 3",
    address: "456 Võ Văn Tần, Quận 3, TP.HCM",
    phone: "0282234567",
    isParent: false,
    isActive: true,
    status: "ACTIVE",
    managerId: 7,
  },
  {
    id: 3,
    name: "Chi nhánh Thủ Đức",
    address: "789 Võ Văn Ngân, Thủ Đức, TP.HCM",
    phone: "0283234567",
    isParent: false,
    isActive: true,
    status: "ACTIVE",
    managerId: null,
  },
  {
    id: 4,
    name: "Chi nhánh Quận 5",
    address: "321 Trần Hưng Đạo, Quận 5, TP.HCM",
    phone: "0284234567",
    isParent: false,
    isActive: false,
    status: "INACTIVE",
    managerId: null,
  },
];
