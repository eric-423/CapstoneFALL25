"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, Utensils } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/utils/hooks";
import {
  getBranches,
  GET_BRANCHES_QUERY_KEY,
  GET_BRANCHES_STALE_TIME,
  Branch,
  CustomerInformation,
  getNearbyBranches,
  NearbyBranch,
} from "@/apis/branch.api";
import { getCustomerInformation } from "@/apis/user.api";
import {
  getProductType,
  GET_PRODUCT_TYPE_QUERY_KEY,
  GET_PRODUCT_TYPE_STALE_TIME,
  ProductType,
} from "@/apis/product.api";
import { setCookie } from "@/utils/cookies.client";

interface SearchFormProps {
  className?: string;
}

export function SearchForm({ className }: SearchFormProps) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const { data: branchesData = [], isLoading: isLoadingBranches } = useQuery<
    Branch[]
  >({
    queryKey: [GET_BRANCHES_QUERY_KEY],
    queryFn: () => getBranches(),
    staleTime: GET_BRANCHES_STALE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Call API nearby branches khi có địa chỉ
  const { data: nearbyBranchesData = [], isLoading: isLoadingNearbyBranches } =
    useQuery<NearbyBranch[]>({
      queryKey: ["nearby-branches", selectedLocation],
      queryFn: () => getNearbyBranches(selectedLocation, 20),
      enabled: Boolean(selectedLocation && selectedLocation.trim()),
      staleTime: 1000 * 60 * 5, // 5 phút
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const { data: productTypes = [], isLoading: isLoadingProductTypes } =
    useQuery({
      queryKey: [GET_PRODUCT_TYPE_QUERY_KEY],
      queryFn: () => getProductType(),
      staleTime: GET_PRODUCT_TYPE_STALE_TIME,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const { data: customerInformationData, isLoading: isLoadingCustomerInfos } =
    useQuery({
      queryKey: ["customer-informations", user?.id],
      queryFn: () => getCustomerInformation(user?.id ?? 0),
      enabled: Boolean(user?.id),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const customerInformations = useMemo(() => {
    if (Array.isArray(customerInformationData?.data)) {
      return customerInformationData.data as CustomerInformation[];
    }
    if (Array.isArray(customerInformationData)) {
      return customerInformationData as CustomerInformation[];
    }
    return [];
  }, [customerInformationData]);

  const primaryAddress = useMemo(() => {
    if (!customerInformations.length) return "";
    const defaultInfo = customerInformations.find((info) => info.isDefault);
    return (defaultInfo ?? customerInformations[0])?.address || "";
  }, [customerInformations]);

  useEffect(() => {
    if (primaryAddress && !selectedLocation) {
      setSelectedLocation(primaryAddress);
    }
  }, [primaryAddress, selectedLocation]);

  const saveBranchToStorage = useCallback(
    (branchId: string) => {
      const branchIdNum = parseInt(branchId, 10);
      const branchData = branchesData.find((b) => b.id === branchIdNum);
      if (branchData) {
        const branchToStore = {
          branchId: branchData.id,
          branchName: branchData.name,
          address: branchData.address ?? "",
          phone: branchData.phone ?? "",
          isActive: branchData.active,
        };
        localStorage.setItem("selectedBranch", JSON.stringify(branchToStore));

        const expiresDate = new Date();
        expiresDate.setFullYear(expiresDate.getFullYear() + 1);
        setCookie("branchId", branchData.id.toString(), expiresDate);

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("branchChanged", { detail: branchToStore })
          );
        }
      }
    },
    [branchesData]
  );
  useEffect(() => {
    if (branchesData.length > 0 && !selectedBranch) {
      const firstActiveBranch = branchesData.find((branch) => branch.active);
      if (firstActiveBranch) {
        const branchId = firstActiveBranch.id.toString();
        setSelectedBranch(branchId);
        saveBranchToStorage(branchId);
      }
    }
  }, [branchesData, selectedBranch, saveBranchToStorage]);

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    saveBranchToStorage(value);
  };

  const branchesWithDistance = useMemo(() => {
    if (!selectedLocation || nearbyBranchesData.length === 0) {
      return branchesData.map((branch) => ({
        ...branch,
        distanceText: undefined,
      }));
    }

    return branchesData.map((branch) => {
      const nearbyBranch = nearbyBranchesData.find(
        (nb) => nb.branchId === branch.id
      );
      return {
        ...branch,
        distanceText: nearbyBranch?.distanceText,
      };
    });
  }, [branchesData, nearbyBranchesData, selectedLocation]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBranch) params.set("branch", selectedBranch);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedLocation) params.set("location", selectedLocation);
    router.push(`/menu?${params.toString()}`);
  };
  const selectedBranchData = useMemo(() => {
    if (!selectedBranch) return null;
    return branchesWithDistance.find(
      (branch) => branch.id.toString() === selectedBranch
    );
  }, [selectedBranch, branchesWithDistance]);

  return (
    <div
      className={`bg-card rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            Chọn chi nhánh
          </label>
          <Select
            value={selectedBranch}
            onValueChange={handleBranchChange}
            disabled={isLoadingBranches || isLoadingNearbyBranches}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  isLoadingBranches || isLoadingNearbyBranches
                    ? "Đang tải..."
                    : "Chọn chi nhánh..."
                }
              />
            </SelectTrigger>
            <SelectContent>
              {branchesWithDistance
                .filter((branch) => branch.active)
                .map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {selectedBranchData?.distanceText ? (
            <p className="text-xs text-gray-500 italic mt-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
              Từ nhà hàng đến bạn: {selectedBranchData.distanceText}
            </p>
          ) : (
            <div className="h-5 mt-1"></div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-orange-500" />
            Thể loại món ăn
          </label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            disabled={isLoadingProductTypes}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  isLoadingProductTypes ? "Đang tải..." : "Thể loại món ăn..."
                }
              />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((productType: ProductType) => (
                <SelectItem
                  key={productType.id}
                  value={productType.id.toString()}
                >
                  {productType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="h-5 mt-1"></div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            Vị trí hiện tại
          </label>
          <Select
            value={selectedLocation}
            onValueChange={setSelectedLocation}
            disabled={
              isLoadingCustomerInfos || customerInformations.length === 0
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  isLoadingCustomerInfos
                    ? "Đang tải..."
                    : !user
                      ? "Vui lòng đăng nhập"
                      : customerInformations.length === 0
                        ? "Chưa có địa chỉ"
                        : "Vị trí hiện tại..."
                }
              />
            </SelectTrigger>
            {customerInformations.length > 0 && (
              <SelectContent>
                {customerInformations.map((info) => (
                  <SelectItem key={info.informationId} value={info.address}>
                    {info.address}
                  </SelectItem>
                ))}
              </SelectContent>
            )}
          </Select>
          <div className="h-5 mt-1"></div>
        </div>

        <div className="space-y-2">
          <div className="h-6"></div>
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 w-full"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5 mr-2" />
            Tìm kiếm
          </Button>
          <div className="h-5 mt-1"></div>
        </div>
      </div>
    </div>
  );
}
