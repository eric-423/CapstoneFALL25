"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Gift,
  Power,
  CheckCircle,
  XCircle,
  Percent,
  Tag,
  Calendar,
  Users as UsersIcon,
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
  const percentage = Math.min((promo.usageCount / 100) * 100, 100);

  return (
    <Card className="relative overflow-hidden p-5 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl group">
      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#FFFCF7] rounded-lg flex items-center justify-center border border-gray-200 group-hover:border-gray-300 transition-all">
              <Gift size={18} className="text-gray-700" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                {promo.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Tag size={10} className="text-gray-400" strokeWidth={2} />
                <span className="text-xs font-mono font-medium text-gray-500 bg-[#FFFCF7] px-2 py-0.5 rounded border border-gray-200">
                  {promo.id.substring(0, 8)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-semibold border shrink-0 ${
            promo.status
              ? "bg-[#FFFCF7] text-gray-700 border-gray-300"
              : "bg-white text-gray-500 border-gray-200"
          }`}
        >
          {promo.status ? (
            <CheckCircle
              size={12}
              strokeWidth={2.5}
              className="text-green-600"
            />
          ) : (
            <XCircle size={12} strokeWidth={2.5} className="text-gray-400" />
          )}
          {promo.status ? "Hoạt động" : "Tắt"}
        </span>
      </div>

      <div className=" space-y-3 mb-1 p-4 bg-[#FFFCF7] rounded-lg border border-gray-100">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-5 flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-gray-200 flex-shrink-0">
              <Percent size={14} className="text-gray-700" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">
                Giảm giá
              </p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {promo.promotionTypeName.includes("%")
                  ? `${promo.value}%`
                  : `${promo.value.toLocaleString()}đ`}
              </p>
            </div>
          </div>
          <div className="col-span-7 flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-gray-200 flex-shrink-0">
              <Calendar size={14} className="text-gray-700" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">
                Thời gian
              </p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {new Date(promo.startDate).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                -{" "}
              </p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {new Date(promo.endDate).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-gray-200 flex-shrink-0">
            <Tag size={14} className="text-gray-700" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">
              Đơn tối thiểu
            </p>
            <p className="text-sm font-bold text-gray-900 truncate">
              {promo.minimumOrderValue.toLocaleString()}đ
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-gray-200 flex-shrink-0">
            <UsersIcon size={14} className="text-gray-700" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Đã sử dụng
              </p>
              <span className="text-xs font-bold text-gray-900">
                {promo.usageCount} lượt
              </span>
            </div>
            <div className="relative h-2 bg-white rounded-full overflow-hidden border border-gray-200">
              <div
                className="absolute top-0 left-0 h-full bg-gray-300 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {promo.usageCount > 0 ? "Đang sử dụng" : "Chưa sử dụng"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <AssignPromotionDialog
          promotionCode={promo.id}
          promotionName={promo.name}
          onSuccess={onSuccess}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(promo.id, promo.status)}
          className={`flex-1 border font-semibold rounded-lg transition-all duration-300 py-2 text-xs ${
            promo.status
              ? "border-red-300 text-red-600 bg-white hover:bg-red-50 hover:border-red-400"
              : "border-brown text-brown bg-white hover:bg-[#FFFCF7] hover:border-gray-400"
          }`}
        >
          <Power size={12} className="mr-1.5" strokeWidth={2.5} />
          {promo.status ? "Tắt" : "Bật"}
        </Button>
      </div>
    </Card>
  );
}
