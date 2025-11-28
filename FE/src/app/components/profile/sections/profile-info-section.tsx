"use client";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { UserAuthData } from "@/utils/types/user.type";
import AddressManagementSection from "./address-management-section";

import {
  CircleUserRound,
  LucideUser,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";

interface ProfileInfoSectionProps {
  user: UserAuthData;
  totalOrders?: number;
  totalEarnedPoints?: number;
  isLoading?: boolean;
  addAddressRef?: React.MutableRefObject<(() => void) | null>;
}

export default function ProfileInfoSection({
  user,
  totalOrders,
  totalEarnedPoints = 0,
  isLoading,
  addAddressRef,
}: ProfileInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-6">
        <Card className="bg-transparent shadow-none border-0 w-full max-w-2xl">
          {isLoading ? (
            <div className="p-4 text-center">
              <LoadingSpinner />
            </div>
          ) : (
            <CardContent className="space-y-6 mt-2">
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="space-y-2 items-center justify-center text-center flex-shrink-0">
                  <div className="flex justify-center">
                    <CircleUserRound className="h-20 w-20" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {user?.fullName || "Khách hàng"}
                  </h3>
                  <div className="flex items-center gap-1 justify-center">
                    <Phone className="h-4 w-4" />
                    {user?.phoneNumber}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
                  <div className="bg-blue-50 p-4 rounded-lg w-full sm:flex-1">
                    <div className="flex items-center gap-2 justify-center">
                      <ShoppingBag className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">
                        Tổng đơn hàng
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 mt-1 text-center">
                      {totalOrders || 0}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg w-full sm:flex-1">
                    <div className="flex items-center gap-2 justify-center">
                      <LucideUser className="h-5 w-5 text-[#C04A00]" />
                      <span className="text-sm font-medium text-[#C04A00]">
                        Điểm đã kiếm
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-[#EC6426] mt-1 text-center">
                      {totalEarnedPoints.toLocaleString()} điểm
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {user?.id && (
          <div className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <MapPin className="h-5 w-5" />
                Địa chỉ của bạn
              </CardTitle>
            </CardHeader>
            <div className="max-h-[420px] overflow-y-auto space-y-4">
              <AddressManagementSection
                userId={user.id}
                onAddClickRef={addAddressRef}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
