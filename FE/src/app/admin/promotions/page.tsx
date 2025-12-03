"use client";

import { AdminGuard } from "@/components/guards";
import { Gift, CheckCircle, XCircle, Search, X, Users } from "lucide-react";
import { AddPromotionDialog } from "./components/AddPromotionDialog";
import { PromotionCard } from "./components/PromotionCard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllPromotions,
  togglePromotionStatus,
  type Promotion,
} from "@/apis/promotion.api";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../components/AdminPageLayout";
import { AdminCard } from "../components/AdminCard";
import { FilterDropdown } from "../components/FilterDropdown";
import { Button } from "@/components/ui/button";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      const data = await getAllPromotions();
      setPromotions(data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleToggleStatus = async (
    promotionCode: string,
    currentStatus: boolean
  ) => {
    try {
      await togglePromotionStatus(promotionCode, !currentStatus);
      toast.success(
        `✅ ${!currentStatus ? "Kích hoạt" : "Tắt"} khuyến mãi thành công!`
      );
      fetchPromotions();
    } catch (error) {
      console.error("Error toggling promotion status:", error);
      toast.error("Có lỗi xảy ra!");
    }
  };

  const activePromotions = promotions.filter((p) => p.status);
  const totalUsage = promotions.reduce((sum, p) => sum + p.usageCount, 0);

  // Filter promotions
  const filteredPromotions = promotions.filter(promo => {
    const matchesKeyword = !searchKeyword ||
      promo.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchesStatus = !statusFilter ||
      (statusFilter === 'active' && promo.status) ||
      (statusFilter === 'inactive' && !promo.status);

    return matchesKeyword && matchesStatus;
  });

  const handleClearFilters = () => {
    setSearchKeyword('');
    setStatusFilter('');
  };

  return (
    <AdminGuard>
      <AdminPageLayout>
        <AdminPageHeader
          title="Quản Lý Khuyến Mãi"
          icon={Gift}
          actions={<AddPromotionDialog onSuccess={fetchPromotions} />}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <AdminCard title="Tổng khuyến mãi" value={promotions.length} icon={Gift} subtitle="Trong hệ thống" />
          <AdminCard
            title="Đang hoạt động"
            value={activePromotions.length}
            icon={CheckCircle}
            subtitle="Có thể sử dụng"
          />
          <AdminCard
            title="Đã tắt"
            value={promotions.length - activePromotions.length}
            icon={XCircle}
            subtitle="Tạm ngừng"
          />
          <AdminCard title="Tổng lượt dùng" value={totalUsage} icon={Users} subtitle="Đã sử dụng" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-[#EBD187]/20 to-[#78A243]/10 backdrop-blur-sm border-[#78A243]/20 border shadow-sm rounded-xl">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
              <input
                type="text"
                placeholder="Tìm theo tên, mô tả..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full max-w-[280px] pl-10 pr-4 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 outline-none"
              />
            </div>
            <FilterDropdown
              label="Tất cả trạng thái"
              title="Lọc theo trạng thái"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              items={[
                { value: "active", label: "Đang hoạt động" },
                { value: "inactive", label: "Đã tắt" }
              ]}
              className="w-[180px]"
            />

            {(searchKeyword || statusFilter) && (
              <Button
                onClick={handleClearFilters}
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4 mr-1" />
                Xóa lọc
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-12 h-12 border-4 border-[#78A243]/30 border-t-[#78A243] rounded-full animate-spin mx-auto mb-4"></div>
            <p>Đang tải danh sách khuyến mãi...</p>
          </div>
        ) : filteredPromotions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Gift className="h-16 w-16 mx-auto mb-4 text-[#78A243]/30" />
            <p className="font-semibold">Không tìm thấy khuyến mãi nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPromotions.map((promo) => (
              <PromotionCard
                key={promo.id}
                promotion={promo}
                onToggleStatus={handleToggleStatus}
                onSuccess={fetchPromotions}
              />
            ))}
          </div>
        )}
      </AdminPageLayout>
    </AdminGuard>
  );
}
