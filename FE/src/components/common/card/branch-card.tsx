import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Branch } from '@/types/branch.type';

import { MapPin, Phone, Store } from 'lucide-react';

type BranchCardProps = {
  item: Branch;
  className?: string;
};

export const BranchCard = ({ item, className }: BranchCardProps) => {
  return (
    <Card className={cn(className, 'bg-white p-0 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow')}>
      <div className='flex gap-4'>
        <div className='w-16 h-16 bg-primary/10 rounded-full overflow-hidden content-center flex-shrink-0'>
          <Store className='w-12 h-12 text-primary m-auto' />
        </div>
        <div className='flex-grow'>
          <h3 className='font-bold text-lg'>{item.name}</h3>
          <div className='flex items-center mt-2 text-gray-600'>
            <MapPin className='h-4 w-4 mr-2' />
            <span className='text-sm'>{item.address}</span>
          </div>
          <div className='flex items-center mt-1 text-gray-600'>
            <Phone className='h-4 w-4 mr-2' />
            <span className='text-sm'>{item.phone}</span>
          </div>
        </div>
      </div>
      <div className='-mt-10 flex justify-end'>
        <Button variant='outline' size='sm' className='text-primary border-primary hover:bg-primary hover:text-white'>
          Chỉ đường
        </Button>
      </div>
    </Card>
  );
};
