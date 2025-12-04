"use client";

import { AdminGuard } from "@/components/guards";
import {
  Gift,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Users,
} from "lucide-react";
import { AddPromotionDialog } from "./components/AddPromotionDialog";
import { PromotionCard } from "./components/PromotionCard";
import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getAllPromotions,
  togglePromotionStatus,
  type Promotion,
  type PromotionsPageResponse,
} from "@/apis/promotion.api";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../components/AdminPageLayout";
import { AdminCard } from "../components/AdminCard";
import { Button } from "@/components/ui/button";
import { FilterDropdown } from "../components/FilterDropdown";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(12);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchPromotions = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getAllPromotions({
        page: currentPage,
        size: pageSize,
        sortBy: "createdAt",
        sortDirection: "DESC",
      });

      if (result && typeof result === "object" && "content" in result) {
        const pageResponse = result as PromotionsPageResponse;
        setPromotions(pageResponse.content || []);
        setTotalPages(pageResponse.totalPages || 0);
        setTotalElements(pageResponse.totalElements || 0);
      } else if (Array.isArray(result)) {
        setPromotions(result);
        setTotalPages(Math.ceil(result.length / pageSize));
        setTotalElements(result.length);
      } else {
        setPromotions([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.error("❌ Không thể tải danh sách khuyến mãi!");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleToggleStatus = async (
    promotionCode: string,
    currentStatus: boolean
  ) => {
    try {
      await togglePromotionStatus(promotionCode, !currentStatus);
      toast.success(
        `${!currentStatus ? "Kích hoạt" : "Tắt"} khuyến mãi thành công!`
      );
      fetchPromotions();
    } catch (error) {
      console.error("Error toggling promotion status:", error);
      toast.error("Có lỗi xảy ra!");
    }
  };

  const [allPromotionsForStats, setAllPromotionsForStats] = useState<
    Promotion[]
  >([]);

  useEffect(() => {
    const fetchAllForStats = async () => {
      try {
        const result = await getAllPromotions({ page: 0, size: 1000 });
        if (result && typeof result === "object" && "content" in result) {
          setAllPromotionsForStats(
            (result as PromotionsPageResponse).content || []
          );
        } else if (Array.isArray(result)) {
          setAllPromotionsForStats(result);
        }
      } catch (error) {
        console.error("Error fetching all promotions for stats:", error);
      }
    };
    fetchAllForStats();
  }, []);

  const activePromotions = useMemo(
    () => allPromotionsForStats.filter((p) => p.status),
    [allPromotionsForStats]
  );
  const totalUsage = useMemo(
    () =>
      allPromotionsForStats.reduce((sum, p) => sum + (p.usageCount || 0), 0),
    [allPromotionsForStats]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const filteredPromotions = promotions.filter((promo) => {
    const matchesKeyword =
      !searchKeyword ||
      promo.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && promo.status) ||
      (statusFilter === "inactive" && !promo.status);

    return matchesKeyword && matchesStatus;
  });

  const handleClearFilters = () => {
    setSearchKeyword("");
    setStatusFilter("");
  };

  return (
    <AdminGuard>
      <AdminPageLayout>
        <AdminPageHeader
          title="Quản Lý Khuyến Mãi"
          icon={Gift}
          actions={<AddPromotionDialog onSuccess={fetchPromotions} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <AdminCard
            title="Tổng KM"
            value={allPromotionsForStats.length}
            icon={Gift}
          />
          <AdminCard
            title="Đang hoạt động"
            value={activePromotions.length}
            icon={CheckCircle}
            subtitle="Có thể sử dụng"
          />
          <AdminCard
            title="Kết thúc"
            value={allPromotionsForStats.length - activePromotions.length}
            icon={XCircle}
            subtitle="Tạm ngừng"
          />
          <AdminCard
            title="Tổng lượt dùng"
            value={totalUsage}
            icon={Users}
            subtitle="Đã sử dụng"
          />
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
                { value: "inactive", label: "Đã tắt" },
              ]}
              className="w-[180px]"
            />

            {(searchKeyword || statusFilter) && (
              <Button onClick={handleClearFilters} variant="ghost" size="sm">
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPromotions.map((promo) => (
                <PromotionCard
                  key={promo.id}
                  promotion={promo}
                  onToggleStatus={handleToggleStatus}
                  onSuccess={fetchPromotions}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-6 px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Trang{" "}
                  <span className="font-semibold text-[#78A243]">
                    {currentPage + 1}
                  </span>{" "}
                  / {totalPages}
                  {totalElements > 0 && (
                    <span className="ml-2 text-gray-500">
                      (Hiển thị {filteredPromotions.length} / {totalElements}{" "}
                      khuyến mãi)
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0 || isLoading}
                    variant="outline"
                    size="sm"
                    className="border-[#78A243]/30 text-[#78A243] hover:bg-[#78A243]/10"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Trước
                  </Button>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1 || isLoading}
                    variant="outline"
                    size="sm"
                    className="border-[#78A243]/30 text-[#78A243] hover:bg-[#78A243]/10"
                  >
                    Sau
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </AdminPageLayout>
    </AdminGuard>
  );
}
