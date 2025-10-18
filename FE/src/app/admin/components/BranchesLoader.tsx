'use client';

import { useEffect } from 'react';
import { useAdminContext } from '@/utils/contexts/AdminContext';

// Mock branches data - replace with real API call
const mockBranches = [
    {
        id: '1',
        name: 'Chi nhánh Quận 1',
        code: 'Q1',
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    },
    {
        id: '2',
        name: 'Chi nhánh Quận 3',
        code: 'Q3',
        address: '456 Lê Văn Sỹ, Quận 3, TP.HCM',
    },
    {
        id: '3',
        name: 'Chi nhánh Thủ Đức',
        code: 'TD',
        address: '789 Đại học, Thủ Đức, TP.HCM',
    },
    {
        id: '4',
        name: 'Chi nhánh Tân Bình',
        code: 'TB',
        address: '321 Cộng Hòa, Tân Bình, TP.HCM',
    },
];

export function BranchesLoader() {
    const { setBranches, setSelectedBranch } = useAdminContext();

    useEffect(() => {
        // TODO: Replace with real API call
        // const fetchBranches = async () => {
        //   const response = await fetch('/api/branches');
        //   const data = await response.json();
        //   setBranches(data);
        // };
        // fetchBranches();

        setBranches(mockBranches);

        // Set default to first branch or "All Branches"
        // setSelectedBranch(mockBranches[0]); // Uncomment to default to first branch
    }, [setBranches]);

    return null;
}
