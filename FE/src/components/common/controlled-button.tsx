import { cn } from '@/lib/utils';

import { VariantProps } from 'class-variance-authority';
import React from 'react';

import { Button, buttonVariants } from '../ui/button';

const ControlledButton = ({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    children: React.ReactNode;
  }) => {
  return (
    <Button
      variant='ghost'
      size='icon'
      className={cn(
        buttonVariants({ variant, size, className }),
        'h-8 w-8 rounded-full flex items-center justify-center bg-transparent text-foreground/50 hover:text-foreground/70 hover:bg-foreground/10 transition-colors',
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ControlledButton;
