import { cn } from '@/lib/utils';

import { ReactNode } from 'react';

type StyledHeadingProps = {
  text: string | ReactNode;
  lineColor?: string;
  className?: string;
};

const StyledHeading = ({ text, className, lineColor }: StyledHeadingProps) => {
  return (
    <>
      <span className={cn('relative inline-block', className)}>
        {text}
        <svg
          className='absolute -bottom-2 left-0 w-full h-full pt-2'
          viewBox='0 0 200 8'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M1 5.5C32 1.5 62 1.5 101 5.5C138 9.5 170 9.5 199 5.5'
            stroke={lineColor || '#F8A91F'}
            strokeWidth='2'
            fill='none'
            strokeLinecap='round'
          />
        </svg>
      </span>
    </>
  );
};

export default StyledHeading;
