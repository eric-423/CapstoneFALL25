import { useEffect } from 'react';
import { useAdminContext } from '@/utils/contexts/AdminContext';
import { getBranches } from '@/apis/branch.api';

export function BranchesLoader() {
    const { setBranches } = useAdminContext();

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const data = await getBranches();
                setBranches(data);
            } catch (error) {
                console.error('Failed to fetch branches:', error);
            }
        };

        fetchBranches();
    }, [setBranches]);

    return null;
}
