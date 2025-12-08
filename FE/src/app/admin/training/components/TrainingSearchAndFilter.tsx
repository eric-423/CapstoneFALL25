"use client";

import { Search, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const hasFilters = searchQuery || selectedStatus !== "all";

  const handleClearFilters = () => {
    onSearchChange("");
    onStatusChange("all");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white backdrop-blur-sm border-gray-300 border shadow-sm rounded-xl">
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full max-w-[250px] pl-10 pr-4 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 outline-none transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto">
          {statuses.map((status) => (
            <Button
              key={status.value}
              onClick={() => onStatusChange(status.value)}
              variant={selectedStatus === status.value ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap transition-all ${
                selectedStatus === status.value
                  ? "bg-[#78A243] text-white hover:bg-[#78A243]/90"
                  : "border-[#78A243]/30 text-[#2D1E1A] hover:bg-[#78A243]/10"
              }`}
            >
              {status.label}
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-white/20">
                {status.count}
              </span>
            </Button>
          ))}
        </div>

        {hasFilters && (
          <Button
            onClick={handleClearFilters}
            variant="ghost"
            size="sm"
            className="text-[#2D1E1A]/70 hover:text-[#2D1E1A] hover:bg-[#EBD187]/30"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa lọc
          </Button>
        )}
      </div>

      {/* Refresh Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onRefetch}
        disabled={isFetching}
        className="border-[#78A243]/30 text-[#78A243] hover:bg-[#78A243]/10"
      >
        <RefreshCw
          size={14}
          className={`mr-1.5 ${isFetching ? "animate-spin" : ""}`}
        />
        Làm mới
      </Button>
    </div>
  );
}
