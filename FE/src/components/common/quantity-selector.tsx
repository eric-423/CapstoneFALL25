import { cn } from "@/utils/lib/utils";

import { Minus, Plus } from "lucide-react";

import { Button } from "../ui/button";

interface QuantitySelectorProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  small?: boolean;
  className?: string;
  maxValue?: number;
}

export function QuantitySelector({
  value,
  onDecrease,
  onIncrease,
  small = false,
  className,
  maxValue,
}: QuantitySelectorProps) {
  const isMaxReached = maxValue !== undefined && value >= maxValue;
  
  return (
    <div
      className={cn(
        `flex items-center ${small ? "gap-1" : "gap-2"}`,
        className
      )}
    >
      <Button
        type="button"
        variant="outline"
        size={small ? "sm" : "icon"}
        onClick={onDecrease}
        disabled={value <= 1}
        className={`rounded-full border-gray-300 ${small ? "h-6 w-6" : "h-8 w-8"}`}
      >
        <Minus className={small ? "h-3 w-3" : "h-4 w-4"} />
      </Button>
      <span className={`font-medium ${small ? "w-5" : "w-6"} text-center`}>
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size={small ? "sm" : "icon"}
        onClick={onIncrease}
        disabled={isMaxReached}
        className={`rounded-full border-gray-300 ${small ? "h-6 w-6" : "h-8 w-8"}`}
      >
        <Plus className={small ? "h-3 w-3" : "h-4 w-4"} />
      </Button>
    </div>
  );
}
