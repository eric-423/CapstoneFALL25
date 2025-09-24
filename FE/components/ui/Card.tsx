import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({
        className,
        variant = 'default',
        padding = 'md',
        hoverable = false,
        children,
        onClick,
        ...props
    }, ref) => {
        return (
            <div
                className={cn(
                    // Base styles
                    "rounded-lg bg-white text-gray-900",

                    // Variant styles
                    variant === 'default' && "border border-gray-200",
                    variant === 'elevated' && "shadow-md border border-gray-100",
                    variant === 'outlined' && "border-2 border-gray-300",

                    // Padding styles
                    padding === 'none' && "p-0",
                    padding === 'sm' && "p-3",
                    padding === 'md' && "p-4",
                    padding === 'lg' && "p-6",

                    // Interactive styles
                    hoverable && "transition-all duration-200 hover:shadow-lg cursor-pointer",
                    onClick && "cursor-pointer",

                    className
                )}
                onClick={onClick}
                ref={ref}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

// Card sub-components
export interface CardHeaderProps {
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    subtitle,
    action,
    children,
    className
}) => {
    return (
        <div className={cn("flex flex-col space-y-1.5 pb-4", className)}>
            {(title || subtitle || action) && (
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        {title && (
                            <h3 className="text-lg font-semibold leading-none tracking-tight">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-sm text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {action && <div className="flex-shrink-0">{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

export interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
    return (
        <div className={cn("flex-1", className)}>
            {children}
        </div>
    );
};

export interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
    return (
        <div className={cn("flex items-center pt-4", className)}>
            {children}
        </div>
    );
};

export default Card;