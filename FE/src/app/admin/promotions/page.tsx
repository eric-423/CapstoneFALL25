"use client";

import { AdminGuard } from "@/components/guards";
import { Gift, CheckCircle, XCircle } from "lucide-react";
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

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      toast.error("❌ Có lỗi xảy ra!");
    }
  };

  const activePromotions = promotions.filter((p) => p.status);
  const totalUsage = promotions.reduce((sum, p) => sum + p.usageCount, 0);

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
          <AdminCard title="Tổng KM" value={promotions.length} icon={Gift} />
          <AdminCard
            title="Hoạt động"
            value={activePromotions.length}
            icon={CheckCircle}
          />
          <AdminCard
            title="Kết thúc"
            value={promotions.length - activePromotions.length}
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
        )}
      </AdminPageLayout>
    </AdminGuard>
  );
}
