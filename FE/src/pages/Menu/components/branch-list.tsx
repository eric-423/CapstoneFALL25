import { BranchSmallCard } from '@/components/common/card';
import { Branch } from '@/types/branch.type';

import { Dispatch, SetStateAction } from 'react';

type BranchListProps = {
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: Dispatch<SetStateAction<Branch | null>>;
};

const BranchList = ({ branches, selectedBranch, setSelectedBranch }: BranchListProps) => {
  return (
    <>
      <div className='space-y-3 max-h-[200px] overflow-y-auto'>
        {branches.map((store) => (
          <BranchSmallCard
            key={store.id}
            store={store}
            onClick={() => setSelectedBranch(store)}
            className={selectedBranch?.id === store.id ? 'bg-primary/10' : 'hover:bg-primary/10'}
          />
        ))}
      </div>
    </>
  );
};

export default BranchList;
