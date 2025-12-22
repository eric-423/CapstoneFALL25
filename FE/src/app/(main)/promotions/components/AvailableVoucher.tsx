"use client";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Promotion } from "@/apis/promotion.api";
import {
  Gift,
  Calendar,
  Tag,
  CheckCircle2,
  Percent,
  ShoppingCart,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface AvailableVoucherProps {
  promotions: Promotion[];
  isLoading: boolean;
}

export default function AvailableVoucher({
  promotions,
  isLoading,
}: AvailableVoucherProps) {
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
            Hiện tại không có khuyến mãi nào khả dụng
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (promotion: Promotion) => {
    if (promotion.userPromotionStatus === "AVAILABLE") {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Có thể sử dụng
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="bg-gray-500/50 text-white">
        <Tag className="h-3 w-3 mr-1" />
        {promotion.userPromotionStatus || "Khả dụng"}
      </Badge>
    );
  };

  const availablePromotions = promotions.filter(
    (promotion) => promotion.userPromotionStatus !== "USED"
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Khuyến mãi khả dụng ({availablePromotions.length})
        </h2>
        <p className="text-sm text-gray-600">
          Danh sách các khuyến mãi bạn có thể sử dụng ngay bây giờ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-6xl">
        {availablePromotions.map((promotion) => (
          <Card
            key={promotion.id}
            className="bg-white hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#EC6426]/40 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EC6426]/8 to-[#F8A91F]/8 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="pb-2 pt-3 px-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-[#EC6426] transition-colors mb-0.5 line-clamp-1">
                      {promotion.name}
                    </CardTitle>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {promotion.description}
                    </p>
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0">
                  {getStatusBadge(promotion)}
                </div>
              </div>
            </CardHeader>

            <CardContent
              className="space-y-3 relative z-10 px-4 pb-4 flex-shrink-0"
            >
              <div className="bg-gradient-to-r from-[#EC6426]/10 to-[#F8A91F]/10 rounded-lg p-3 border border-[#EC6426]/20">
                {
                  !promotion.promotionTypeName?.includes("Miễn phí vận chuyển") && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Percent className="h-4 w-4 text-[#EC6426]" />
                      <span className="text-xs font-semibold text-gray-700">
                        Giá trị khuyến mãi
                      </span>
                    </div>
                  )
                }

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#EC6426]">
                    {promotion.promotionTypeName?.includes("Miễn phí vận chuyển")
                      ? "FREE SHIP"
                      : promotion.promotionTypeName?.includes("Giảm giá cố định")
                        ? `${promotion.value.toLocaleString("vi-VN")}đ`
                        : promotion.promotionTypeName?.includes("Giảm giá theo %")
                          ? `${promotion.value}%`
                          : `${promotion.value.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
                {promotion.minimumOrderValue > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#EC6426]/20">
                    <ShoppingCart className="h-3.5 w-3.5 text-gray-600" />
                    <span className="text-xs text-gray-700">
                      Đơn tối thiểu{" "}
                      <span className="font-bold text-gray-900">
                        {promotion.minimumOrderValue.toLocaleString("vi-VN")}đ
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-md p-2 border border-gray-200">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Calendar className="h-3.5 w-3.5 text-[#EC6426]" />
                    <span className="text-[10px] font-semibold text-gray-600 uppercase">
                      Bắt đầu
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-900">
                    {format(new Date(promotion.startDate), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-md p-2 border border-gray-200">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Calendar className="h-3.5 w-3.5 text-[#EC6426]" />
                    <span className="text-[10px] font-semibold text-gray-600 uppercase">
                      Kết thúc
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-900">
                    {format(new Date(promotion.endDate), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </span>
                </div>
              </div>

              {promotion.receivedDate && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-blue-50 rounded-md p-2 border border-blue-200">
                  <Tag className="h-3.5 w-3.5 text-blue-600" />
                  <span className="font-medium text-blue-900">Nhận: </span>
                  <span className="text-blue-700">
                    {format(
                      new Date(promotion.receivedDate),
                      "dd/MM/yyyy HH:mm",
                      {
                        locale: vi,
                      }
                    )}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                {promotion.promotionTypeName && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium border-gray-300"
                  >
                    {promotion.promotionTypeName}
                  </Badge>
                )}
                {promotion.usageCount > 0 && (
                  <span className="text-xs text-gray-600">
                    <span className="font-semibold">
                      {promotion.usageCount}
                    </span>{" "}
                    lần
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
