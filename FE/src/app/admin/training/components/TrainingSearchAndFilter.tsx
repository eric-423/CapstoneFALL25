"use client";

import { Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Status {
  value: string;
  label: string;
  count: number;
}

interface TrainingSearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  statuses: Status[];
  onRefetch: () => void;
  isFetching: boolean;
}

export function TrainingSearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  statuses,
  onRefetch,
  isFetching,
}: TrainingSearchAndFilterProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 relative p-4">
        <Search
          className="absolute left-8 top-1/2 transform -translate-y-1/2 text-orange-400"
          size={20}
          strokeWidth={2.5}
        />
        <Input
          placeholder="Tìm kiếm khóa học..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 py-6 rounded-xl !bg-[#fbdcc5] text-primary"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 items-center">
        {statuses.map((status) => (
          <Button
            key={status.value}
            onClick={() => onStatusChange(status.value)}
            variant={selectedStatus === status.value ? "default" : "outline"}
            className={`rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedStatus === status.value
                ? "bg-[#fbdcc5] text-primary shadow-lg hover:bg-[#fbdcc5]/70"
                : "border-2 border-[#fbdcc5] text-gray-600 hover:border-[#fbdcc5]"
            }`}
          >
            {status.label}
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full">
              {status.count}
            </span>
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefetch}
          className="rounded-xl border-gray-200 text-gray-600 hover:text-primary"
        >
          <RefreshCw
            size={16}
            className={`mr-2 ${isFetching ? "animate-spin" : ""}`}
            strokeWidth={2.5}
          />
          Làm mới
        </Button>
      </div>
    </div>
  );
}

