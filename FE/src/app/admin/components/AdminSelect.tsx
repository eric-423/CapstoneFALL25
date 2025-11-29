"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface AdminSelectOption {
    value: string;
    label: string;
    subLabel?: string;
}

interface AdminSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    options: AdminSelectOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
}

/**
 * A lightweight styled select for admin forms, matching the warehouse branch dropdown look.
 */
export function AdminSelect({
    value,
    onValueChange,
    options,
    placeholder,
    disabled,
    className,
    triggerClassName,
    contentClassName,
}: AdminSelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger
                className={cn(
                    "w-full h-auto min-h-[42px] items-start justify-between border border-[#78A243]/30 bg-white text-sm text-[#2D1E1A] rounded-lg shadow-sm transition-colors",
                    "hover:border-[#78A243]/50 focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20",
                    "px-3 py-2 leading-[1.2] gap-1 text-left data-[placeholder]:text-gray-500",
                    triggerClassName,
                    className
                )}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent
                className={cn(
                    "bg-[#FFFCF7] shadow-lg border border-[#78A243]/20 rounded-lg",
                    contentClassName
                )}
            >
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col leading-[1.2]">
                            <span className="text-[13px] font-semibold text-[#2D1E1A]">{option.label}</span>
                            {option.subLabel && (
                                <span className="text-[11px] text-gray-600 mt-0.5">{option.subLabel}</span>
                            )}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
