import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
        className,
        containerClassName,
        type = 'text',
        label,
        error,
        helperText,
        leftIcon,
        rightIcon,
        disabled,
        required,
        ...props
    }, ref) => {
        const hasError = !!error;

        return (
            <div className={cn("space-y-2", containerClassName)}>
                {label && (
                    <label className={cn(
                        "text-sm font-medium text-gray-700",
                        disabled && "opacity-50"
                    )}>
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        type={type}
                        className={cn(
                            // Base styles
                            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2",
                            "text-sm text-gray-900 placeholder:text-gray-400",
                            "transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium",

                            // Focus styles
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",

                            // Disabled styles
                            "disabled:cursor-not-allowed disabled:opacity-50",

                            // Error styles
                            hasError && "border-red-500 focus-visible:ring-red-500",

                            // Icon padding
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",

                            className
                        )}
                        disabled={disabled}
                        ref={ref}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {(error || helperText) && (
                    <p className={cn(
                        "text-sm",
                        hasError ? "text-red-500" : "text-gray-500"
                    )}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;