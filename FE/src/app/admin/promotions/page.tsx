"use client";

import { AdminGuard } from "@/components/guards";
import {
  Gift,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AddPromotionDialog } from "./components/AddPromotionDialog";
import { PromotionCard } from "./components/PromotionCard";
import { useEffect, useState, useMemo } from "react";
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

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(12);

  const fetchPromotions = async () => {
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
  };

  useEffect(() => {
    fetchPromotions();
  }, [currentPage]);

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
      toast.error("❌ Có lỗi xảy ra!");
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

  return (
    <AdminGuard>
      <AdminPageLayout>
        <AdminPageHeader
          title="Quản Lý Khuyến Mãi"
          description="Tạo và quản lý mã giảm giá"
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
            title="Hoạt động"
            value={activePromotions.length}
            icon={CheckCircle}
          />
          <AdminCard
            title="Kết thúc"
            value={allPromotionsForStats.length - activePromotions.length}
            icon={XCircle}
          />
          <AdminCard title="Tổng lượt dùng" value={totalUsage} icon={Gift} />
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Chưa có khuyến mãi nào</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {promotions.map((promo) => (
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
                      (Hiển thị {promotions.length} / {totalElements} khuyến
                      mãi)
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
