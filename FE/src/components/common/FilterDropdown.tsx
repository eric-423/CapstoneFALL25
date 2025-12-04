"use client";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface FilterItem {
    value: string;
    label: string;
    subLabel?: string;
}

interface FilterDropdownProps {
    label: string;
    title?: string;
    items: FilterItem[];
    value: string;
    onChange: (value: string) => void;
    icon?: React.ElementType;
    className?: string;
    showAllOption?: boolean;
}

export function FilterDropdown({
    label,
    items,
    value,
    onChange,
    icon: Icon,
    className,
    showAllOption = true,
}: FilterDropdownProps) {
    const [open, setOpen] = useState(false);

    const selectedItem = items.find((item) => item.value === value);

    const handleSelect = (itemValue: string) => {
        onChange(itemValue);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "!bg-[#FFFCF7] !text-orange-500 hover:!text-orange-600 hover:!bg-[#FFFCF7] flex items-center gap-x-2 border border-orange-200",
                        className
                    )}
                >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="hidden md:inline font-medium text-sm max-w-[150px] truncate">
                        {selectedItem ? selectedItem.label : label}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto min-w-fit max-w-[calc(100vw-2rem)] p-0 !bg-[#FFFCF7] !z-[9999] max-h-[280px] overflow-hidden"
                align="center"
                sideOffset={8}
                style={{ width: "fit-content", minWidth: "fit-content" }}
            >
                <div className="px-3 py-2 space-y-1 max-h-[264px] overflow-y-auto">
                    {/* Option to clear/select all if needed, or just the items */}
                    {showAllOption && (
                        <Button
                            variant="ghost"
                            onClick={() => handleSelect("")}
                            className={cn(
                                "flex w-full justify-start p-3 h-auto text-left gap-3",
                                value === ""
                                    ? "bg-orange-100 !text-orange-600 font-medium"
                                    : "hover:bg-orange-50 !text-orange-500"
                            )}
                        >
                            <div className="text-left">
                                <div className="font-medium text-sm">Tất cả</div>
                            </div>
                            {value === "" && <Check className="h-4 w-4 ml-auto" />}
                        </Button>
                    )}

                    {items.map((item) => (
                        <Button
                            key={item.value}
                            variant="ghost"
                            onClick={() => handleSelect(item.value)}
                            className={cn(
                                "flex w-full justify-start p-3 h-auto text-left gap-3",
                                value === item.value
                                    ? "bg-orange-100 !text-orange-600 font-medium"
                                    : "hover:bg-orange-50 !text-orange-500"
                            )}
                        >
                            <div className="text-left">
                                <div className="font-medium text-sm">
                                    {item.label}
                                </div>
                                {item.subLabel && (
                                    <div className="text-xs text-gray-600 mt-1">
                                        {item.subLabel}
                                    </div>
                                )}
                            </div>
                            {value === item.value && <Check className="h-4 w-4 ml-auto" />}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
