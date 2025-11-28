'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search, Utensils } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/utils/hooks';
import { getBranches, GET_BRANCHES_QUERY_KEY, GET_BRANCHES_STALE_TIME, Branch, CustomerInformation } from '@/apis/branch.api';
import { getCustomerInformation } from '@/apis/user.api';
import { getProductType, GET_PRODUCT_TYPE_QUERY_KEY, GET_PRODUCT_TYPE_STALE_TIME, ProductType } from '@/apis/product.api';

interface SearchFormProps {
  className?: string;
}

export function SearchForm({ className }: SearchFormProps) {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const { data: branchesData = [], isLoading: isLoadingBranches } = useQuery<Branch[]>({
    queryKey: [GET_BRANCHES_QUERY_KEY],
    queryFn: () => getBranches(),
    staleTime: GET_BRANCHES_STALE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: productTypes = [], isLoading: isLoadingProductTypes } = useQuery({
    queryKey: [GET_PRODUCT_TYPE_QUERY_KEY],
    queryFn: () => getProductType(),
    staleTime: GET_PRODUCT_TYPE_STALE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    data: customerInformationData,
    isLoading: isLoadingCustomerInfos,
  } = useQuery({
    queryKey: ['customer-informations', user?.id],
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
    if (!customerInformations.length) return '';
    const defaultInfo = customerInformations.find((info) => info.isDefault);
    return (defaultInfo ?? customerInformations[0])?.address || '';
  }, [customerInformations]);

  useEffect(() => {
    if (primaryAddress && !selectedLocation) {
      setSelectedLocation(primaryAddress);
    }
  }, [primaryAddress, selectedLocation]);

  // Hàm để lưu branch vào localStorage và dispatch event
  const saveBranchToStorage = useCallback((branchId: string) => {
    const branchIdNum = parseInt(branchId, 10);
    const branchData = branchesData.find((b) => b.id === branchIdNum);
    if (branchData) {
      const branchToStore = {
        branchId: branchData.id,
        branchName: branchData.name,
        address: branchData.address ?? '',
        phone: branchData.phone ?? '',
        isActive: branchData.active,
      };
      localStorage.setItem('selectedBranch', JSON.stringify(branchToStore));

      // Dispatch event để BranchDropdown cập nhật ngay lập tức
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('branchChanged', { detail: branchToStore })
        );
      }
    }
  }, [branchesData]);

  // Set branch mặc định khi có dữ liệu
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

  // Handler khi chọn chi nhánh
  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    saveBranchToStorage(value);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBranch) params.set('branch', selectedBranch);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedLocation) params.set('location', selectedLocation);


    router.push(`/menu?${params.toString()}`);
  };

  return (
    <div className={`bg-card rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            Chọn chi nhánh
          </label>
          <Select value={selectedBranch} onValueChange={handleBranchChange} disabled={isLoadingBranches}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingBranches ? 'Đang tải...' : 'Chọn chi nhánh...'} />
            </SelectTrigger>
            <SelectContent>
              {branchesData
                .filter((branch) => branch.active)
                .map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-orange-500" />
            Thể loại món ăn
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoadingProductTypes}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingProductTypes ? 'Đang tải...' : 'Thể loại món ăn...'} />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((productType: ProductType) => (
                <SelectItem key={productType.id} value={productType.id.toString()}>
                  {productType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            Vị trí hiện tại
          </label>
          <Select
            value={selectedLocation}
            onValueChange={setSelectedLocation}
            disabled={isLoadingCustomerInfos || customerInformations.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  isLoadingCustomerInfos
                    ? 'Đang tải...'
                    : !user
                      ? 'Vui lòng đăng nhập'
                      : customerInformations.length === 0
                        ? 'Chưa có địa chỉ'
                        : 'Vị trí hiện tại...'
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
        </div>

        {/* Search Button */}
        <Button
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
          onClick={handleSearch}
        >
          <Search className="w-5 h-5 mr-2" />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
