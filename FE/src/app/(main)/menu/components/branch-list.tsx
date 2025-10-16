import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction } from 'react';

type Branch = {
    branchId: number;
    branchName: string;
    address: string;
    phone: string;
    isActive: boolean;
};

type BranchListProps = {
    branches: Branch[];
    selectedBranch: Branch | null;
    setSelectedBranch: Dispatch<SetStateAction<Branch | null>>;
};

const BranchList = ({ branches, selectedBranch, setSelectedBranch }: BranchListProps) => {
    return (
        <div className='space-y-3 max-h-[200px] overflow-y-auto'>
            {branches.map((branch) => (
                <Button
                    key={branch.branchId}
                    variant="ghost"
                    onClick={() => setSelectedBranch(branch)}
                    className={`w-full justify-start p-3 h-auto ${selectedBranch?.branchId === branch.branchId ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-primary/10'}`}
                >
                    <div className="text-left">
                        <div className="font-medium text-sm">{branch.branchName}</div>
                        <div className="text-xs text-gray-500 mt-1">{branch.address}</div>
                        <div className="text-xs text-gray-500">{branch.phone}</div>
                    </div>
                </Button>
            ))}
        </div>
    );
};

export default BranchList;