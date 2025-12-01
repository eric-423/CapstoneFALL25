import { useEffect } from 'react';
import { useAdminContext } from '@/utils/contexts/AdminContext';
import { getBranches } from '@/apis/branch.api';

export function BranchesLoader() {
    const { setBranches, setSelectedBranch } = useAdminContext();

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const data = await getBranches();
                // Map API response to Context Branch type if needed, but they should be compatible now
                // API Branch: { id: number, name: string, address: string, ... }
                // Context Branch: { id: number, name: string, address?: string }
                setBranches(data);

                // Optional: Set default branch if needed
                // if (data.length > 0) {
                //     setSelectedBranch(data[0]);
                // }
            } catch (error) {
                console.error('Failed to fetch branches:', error);
            }
        };

        fetchBranches();
    }, [setBranches]);

    return null;
}
