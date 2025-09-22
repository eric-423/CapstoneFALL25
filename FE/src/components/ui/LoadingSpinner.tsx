import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className 
}) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-transparent",
        
        // Size styles
        size === 'sm' && "w-4 h-4 border-[1.5px]",
        size === 'md' && "w-6 h-6 border-2",
        size === 'lg' && "w-8 h-8 border-[3px]",
        
        // Color styles
        color === 'primary' && "border-t-orange-500 border-r-orange-500",
        color === 'secondary' && "border-t-orange-200 border-r-orange-200",
        color === 'white' && "border-t-white border-r-white",
        color === 'current' && "border-t-current border-r-current",
        
        className
      )}
    />
  );
};

export interface SkeletonProps {
  variant?: 'text' | 'avatar' | 'card' | 'button';
  width?: string | number;
  height?: string | number;
  lines?: number; // for text variant
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  lines = 1,
  className
}) => {
  const baseClasses = "animate-pulse bg-gray-200 rounded";
  
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              index === lines - 1 ? "w-3/4" : "w-full",
              "h-4"
            )}
            style={{ width: index === lines - 1 ? '75%' : width, height }}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        baseClasses,
        
        // Variant styles
        variant === 'text' && "h-4",
        variant === 'avatar' && "rounded-full w-10 h-10",
        variant === 'card' && "h-32",
        variant === 'button' && "h-10 w-20",
        
        className
      )}
      style={{ width, height }}
    />
  );
};

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  children?: React.ReactNode;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = "Loading...",
  children,
  className
}) => {
  if (!visible) return null;
  
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-white/80 backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-white border border-gray-200 shadow-lg">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-sm text-gray-600">{message}</p>
        )}
        {children}
      </div>
    </div>
  );
};

export default LoadingSpinner;