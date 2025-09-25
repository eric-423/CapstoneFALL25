import { cn } from '@/lib/utils';
import { Branch } from '@/types/branch.type';

import { MapPin } from 'lucide-react';

type BranchSmallCardProps = {
  store: Branch;
  className?: string;
  onClick?: () => void;
};

export const BranchSmallCard = ({ store, className, onClick }: BranchSmallCardProps) => {
  return (
    <>
      <div
        className={cn(className, 'flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer')}
        onClick={onClick}
      >
        <div className='w-10 h-10 rounded-full bg-background flex items-center justify-center flex-shrink-0'>
          <MapPin className='h-5 w-5 text-primary' />
        </div>
        <div>
          <h4 className='font-medium text-sm'>{store.name}</h4>
          <p className='text-xs text-gray-500'>{store.address}</p>
        </div>
      </div>
    </>
  );
};
