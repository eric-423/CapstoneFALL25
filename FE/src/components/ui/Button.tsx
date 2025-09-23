import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant = 'primary',
        size = 'md',
        loading = false,
        icon,
        iconPosition = 'left',
        disabled,
        children,
        ...props
    }, ref) => {
        return (
            <button
                className={cn(
                    // Base styles
                    "inline-flex items-center justify-center rounded-md font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",

                    // Variant styles
                    variant === 'primary' && [
                        "bg-orange-500 text-white",
                        "hover:bg-orange-600 focus-visible:ring-orange-500",
                    ],
                    variant === 'secondary' && [
                        "bg-orange-50 text-orange-700",
                        "hover:bg-orange-100 focus-visible:ring-orange-500",
                    ],
                    variant === 'outline' && [
                        "border border-gray-300 bg-white text-gray-700",
                        "hover:bg-gray-50 focus-visible:ring-gray-500",
                    ],
                    variant === 'ghost' && [
                        "text-gray-700 hover:bg-gray-100",
                        "focus-visible:ring-gray-500",
                    ],

                    // Size styles
                    size === 'sm' && "h-9 px-3 text-sm gap-2",
                    size === 'md' && "h-10 px-4 text-base gap-2",
                    size === 'lg' && "h-11 px-6 text-lg gap-3",

                    className
                )}
                disabled={disabled || loading}
                ref={ref}
                {...props}
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading...
                    </>
                ) : (
                    <>
                        {icon && iconPosition === 'left' && (
                            <span className="flex-shrink-0">{icon}</span>
                        )}
                        {children}
                        {icon && iconPosition === 'right' && (
                            <span className="flex-shrink-0">{icon}</span>
                        )}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;