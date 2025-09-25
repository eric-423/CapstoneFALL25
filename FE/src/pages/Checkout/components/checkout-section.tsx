import { cn } from '@/lib/utils';

import React from 'react';

interface CheckoutSectionProps {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const CheckoutSection = ({ title, icon, children, className }: CheckoutSectionProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className='text-xl flex items-center'>
        <span className='bg-primary/10 p-2 rounded-full mr-3'>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
};

export default CheckoutSection;
