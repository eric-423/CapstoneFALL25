"use client";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Promotion } from "@/apis/promotion.api";
import { Gift, Calendar, Tag, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface PromotionsSectionProps {
  promotions: Promotion[];
  isLoading: boolean;
}

export default function PromotionsSection({
  promotions,
  isLoading,
}: PromotionsSectionProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!promotions || promotions.length === 0) {
    return (
      <Card className="bg-white">
        <CardContent className="p-8 text-center">
          <Gift className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-base">
            Bạn chưa có mã khuyến mãi nào
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    const usedDate = promotion.usedDate ? new Date(promotion.usedDate) : null;

    if (usedDate) {
      return (
        <Badge variant="secondary" className="bg-gray-500">
          <XCircle className="h-3 w-3 mr-1" />
          Đã sử dụng
        </Badge>
      );
    }

    if (now < startDate) {
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-500">
          <Calendar className="h-3 w-3 mr-1" />
          Sắp diễn ra
        </Badge>
      );
    }

    if (now > endDate) {
      return (
        <Badge variant="secondary" className="bg-red-500">
          <XCircle className="h-3 w-3 mr-1" />
          Hết hạn
        </Badge>
      );
    }

    if (promotion.userPromotionStatus === "ACTIVE") {
      return (
        <Badge className="bg-green-500">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Có thể sử dụng
        </Badge>
      );
    }

    return (
      <Badge variant="outline">
        <Tag className="h-3 w-3 mr-1" />
        {promotion.userPromotionStatus || "Chưa kích hoạt"}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Mã khuyến mãi của tôi ({promotions.length})
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Danh sách các mã khuyến mãi bạn đã nhận được
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promotions.map((promotion) => (
          <Card
            key={promotion.id}
            className="bg-white hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {promotion.name}
                </CardTitle>
                {getStatusBadge(promotion)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {promotion.description}
              </p>

              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-[#EC6426]" />
                <span className="text-lg font-bold text-[#EC6426]">
                  {promotion.value.toLocaleString("vi-VN")}đ
                </span>
                {promotion.minimumOrderValue > 0 && (
                  <span className="text-xs text-gray-500">
                    (Đơn tối thiểu: {promotion.minimumOrderValue.toLocaleString("vi-VN")}đ)
                  </span>
                )}
              </div>

              {promotion.code && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <Tag className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-mono font-semibold text-gray-900">
                    {promotion.code}
                  </span>
                </div>
              )}

              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Từ: {format(new Date(promotion.startDate), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Đến: {format(new Date(promotion.endDate), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </span>
                </div>
                {promotion.usageCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs">
                      Đã sử dụng: {promotion.usageCount} lần
                    </span>
                  </div>
                )}
              </div>

              {promotion.promotionTypeName && (
                <div className="pt-2 border-t">
                  <Badge variant="outline" className="text-xs">
                    {promotion.promotionTypeName}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

