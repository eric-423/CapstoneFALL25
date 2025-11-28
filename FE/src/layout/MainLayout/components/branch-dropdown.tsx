"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, ChevronDown } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Branch as ApiBranch,
  GET_BRANCHES_QUERY_KEY,
  GET_BRANCHES_STALE_TIME,
  getBranches,
} from "@/apis/branch.api";

type Branch = {
  branchId: number;
  branchName: string;
  address: string;
  phone: string;
  isActive: boolean;
  distanceText?: string;
};

export function BranchDropdown() {
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const initializedRef = useRef(false);

  const { data: branchesData = [], isLoading } = useQuery<ApiBranch[]>({
    queryKey: [GET_BRANCHES_QUERY_KEY],
    queryFn: () => getBranches(),
    staleTime: GET_BRANCHES_STALE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const branches = useMemo(() => {
    if (!Array.isArray(branchesData)) return [];
    return branchesData.map(
      (branch): Branch => ({
        branchId: branch.id,
        branchName: branch.name,
        address: branch.address ?? "",
        phone: branch.phone ?? "",
        isActive: branch.active,
      })
    );
  }, [branchesData]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      branches.length === 0 ||
      initializedRef.current
    )
      return;

    const stored = localStorage.getItem("selectedBranch");
    if (stored) {
      try {
        const branch = JSON.parse(stored) as Branch;
        if (branches.some((b) => b.branchId === branch.branchId)) {
          setSelectedBranch(branch);
          initializedRef.current = true;
          return;
        }
      } catch (e) {
        console.error("Error parsing stored branch:", e);
      }
    }

    const firstBranch = branches[0];
    setSelectedBranch(firstBranch);
    localStorage.setItem("selectedBranch", JSON.stringify(firstBranch));
    initializedRef.current = true;
  }, [branches]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBranchChange = (event: CustomEvent) => {
      const branch = event.detail as Branch;
      setSelectedBranch(branch);
    };

    const handleStorageChange = () => {
      const stored = localStorage.getItem("selectedBranch");
      if (stored) {
        try {
          const branch = JSON.parse(stored) as Branch;
          setSelectedBranch(branch);
        } catch (e) {
          console.error("Error parsing stored branch:", e);
        }
      }
    };

    window.addEventListener(
      "branchChanged",
      handleBranchChange as EventListener
    );
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "branchChanged",
        handleBranchChange as EventListener
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleBranchClick = (branch: Branch) => {
    setSelectedBranch(branch);
    localStorage.setItem("selectedBranch", JSON.stringify(branch));
    setOpen(false);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("branchChanged", { detail: branch })
      );
    }
  };

  if (isLoading || branches.length === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="!bg-[#FFFCF7] !text-orange-500 hover:!text-orange-600 hover:!bg-[#FFFCF7] flex items-center gap-x-2 w-full sm:w-auto justify-center sm:justify-start"
        >
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium text-sm max-w-[150px] truncate">
            {selectedBranch?.branchName || "Chọn chi nhánh"}
          </span>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] sm:w-[400px] p-0 !bg-[#FFFCF7] !z-[9999] max-h-[400px] flex flex-col"
        align="center"
        sideOffset={8}
      >
        <div className="p-3 pb-2 flex-shrink-0 border-b border-gray-200">
          <h3 className="text-sm font-semibold !text-orange-500">
            Chọn chi nhánh
          </h3>
        </div>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[350px] w-full">
            <div className="px-3 py-2 space-y-1 w-full">
              {branches.map((branch) => (
                <div
                  key={branch.branchId}
                  onClick={() => handleBranchClick(branch)}
                  className={`w-full p-3 rounded-md cursor-pointer transition-colors ${
                    selectedBranch?.branchId === branch.branchId
                      ? "bg-orange-100 !text-orange-600"
                      : "hover:bg-orange-50 !text-orange-500"
                  }`}
                >
                  <div className="w-full min-w-0">
                    <div
                      className={`text-sm ${selectedBranch?.branchId === branch.branchId ? "font-semibold" : "font-medium"} break-words`}
                    >
                      {branch.branchName}
                    </div>
                    <div
                      className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}
                    >
                      {branch.address}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {branch.phone}
                    </div>
                    {branch.distanceText && (
                      <div className="text-xs text-gray-500 italic mt-1">
                        Khoảng cách: {branch.distanceText}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
