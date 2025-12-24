"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Power,
  PowerOff,
  CheckCircle,
  XCircle,
  Percent,
  Tag,
  Calendar,
  Users as UsersIcon,
  Truck,
  DollarSign,
} from "lucide-react";
import { type Promotion } from "@/apis/promotion.api";
import { AssignPromotionDialog } from "./AssignPromotionDialog";

interface PromotionCardProps {
  promotion: Promotion;
  onToggleStatus: (promotionCode: string, currentStatus: boolean) => void;
  onSuccess: () => void;
}

export function PromotionCard({
  promotion: promo,
  onToggleStatus,
  onSuccess,
}: PromotionCardProps) {

  // Get icon based on promotion type
  const getPromotionTypeIcon = () => {
    if (promo.promotionTypeName.includes("%")) {
      return <Percent size={14} className="text-[#78A243]" strokeWidth={2} />;
    } else if (promo.promotionTypeName.includes("vận chuyển")) {
      return <Truck size={14} className="text-[#78A243]" strokeWidth={2} />;
    }
    return <DollarSign size={14} className="text-[#78A243]" strokeWidth={2} />;
  };

  // Format value based on promotion type
  const getFormattedValue = () => {
    if (promo.promotionTypeName.includes("%")) {
      return `${promo.value}%`;
    } else if (promo.promotionTypeName.includes("vận chuyển")) {
      return "Miễn phí";
    }
    return `${promo.value.toLocaleString()}đ`;
  };

  return (
    <Card className="relative overflow-hidden p-5 bg-white border-2 border-[#78A243]/20 shadow-sm hover:shadow-md hover:border-[#78A243]/40 transition-all duration-300 rounded-xl group">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#78A243]/20 rounded-lg flex items-center justify-center">
              <Gift size={18} className="text-[#78A243]" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-[#2D1E1A] group-hover:text-[#78A243] transition-colors truncate">
                {promo.name}
              </h3>
              <p className="text-xs text-[#2D1E1A]/60 truncate mt-0.5">
                {promo.description}
              </p>
            </div>
          </div>
        </div>
        <Badge className={`shrink-0 ml-2 ${promo.status
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300"
          }`}>
          {promo.status ? (
            <>
              <CheckCircle size={12} className="mr-1" />
              Hoạt động
            </>
          ) : (
            <>
              <XCircle size={12} className="mr-1" />
              Đã tắt
            </>
          )}
        </Badge>
      </div>

      <div className="space-y-3 p-4 bg-gradient-to-r from-[#78A243]/5 to-[#EBD187]/10 rounded-lg border border-[#78A243]/10">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-[#78A243]/20 flex-shrink-0">
              {getPromotionTypeIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#2D1E1A]/60 font-medium">
                {promo.promotionTypeName}
              </p>
              <p className="text-sm font-bold text-[#2D1E1A] truncate">
                {getFormattedValue()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-[#78A243]/20 flex-shrink-0">
              <Tag size={14} className="text-[#78A243]" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#2D1E1A]/60 font-medium">
                Đơn tối thiểu
              </p>
              <p className="text-sm font-bold text-[#2D1E1A] truncate">
                {promo.minimumOrderValue.toLocaleString()}đ
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-[#78A243]/20 flex-shrink-0">
            <Calendar size={14} className="text-[#78A243]" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#2D1E1A]/60 font-medium">
              Thời gian
            </p>
            <p className="text-sm font-bold text-[#2D1E1A]">
              {new Date(promo.startDate).toLocaleDateString("vi-VN")} - {new Date(promo.endDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

      </div>

      <div className="flex gap-2 pt-3 mt-3 border-t border-[#78A243]/10">
        <AssignPromotionDialog
          promotionCode={promo.id}
          promotionName={promo.name}
          onSuccess={onSuccess}
        />
        {promo.status ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(promo.id, promo.status)}
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <PowerOff size={14} className="mr-1.5" />
            Tắt
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(promo.id, promo.status)}
            className="flex-1 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
          >
            <Power size={14} className="mr-1.5" />
            Bật
          </Button>
        )}
      </div>
    </Card>
  );
}
