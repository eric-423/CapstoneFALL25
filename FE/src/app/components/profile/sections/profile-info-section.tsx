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
  Award,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileInfoSectionProps {
  user: UserAuthData;
  totalOrders?: number;

  isLoading?: boolean;
  addAddressRef?: React.MutableRefObject<(() => void) | null>;
}

export default function ProfileInfoSection({
  user,
  totalOrders,
  isLoading,
  addAddressRef,
}: ProfileInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-between">
        <Card className="bg-transparent shadow-none border-0 w-full lg:flex-1 lg:max-w-none">
          {isLoading ? (
            <div className="p-4 text-center">
              <LoadingSpinner />
            </div>
          ) : (
            <CardContent className="space-y-6 mt-2">
              <div className="flex flex-col items-center justify-center gap-6 max-lg:text-center lg:items-start lg:text-left">
                <div className="space-y-2 items-center justify-center text-center flex-shrink-0 max-lg:w-full lg:text-left lg:items-start mx-auto">
                  <div className="flex justify-center lg:justify-center">
                    <CircleUserRound className="h-20 w-20" />
                  </div>
                  <h3 className="text-xl font-semibold text-center">
                    {user?.name || "Khách hàng"}
                  </h3>
                  <div className="flex items-center gap-1 justify-center lg:justify-center">
                    <Phone className="h-4 w-4" />
                    {user?.phoneNumber}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm max-lg:justify-center lg:max-w-none">
                  <div className="bg-blue-50 p-4 rounded-lg w-full sm:flex-1">
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                      <ShoppingBag className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">
                        Tổng đơn hàng
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 mt-1 text-center lg:text-left">
                      {totalOrders || 0}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg w-full sm:flex-1">
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                      <LucideUser className="h-5 w-5 text-[#C04A00]" />
                      <span className="text-sm font-medium text-[#C04A00]">
                        Điểm của bạn
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-[#EC6426] mt-1 text-center lg:text-left">
                      {user?.memberAssociation?.point?.toLocaleString() || '0'} điểm
                    </p>
                  </div>
                </div>

                {user?.memberAssociation && (
                  <div className="mt-4 w-full max-w-sm max-lg:mx-auto lg:max-w-none">
                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 shadow-md">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EC6426] to-[#C04A00] flex items-center justify-center shadow-lg">
                              <Award className="h-8 w-8 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-bold text-gray-900">
                                Hạng thành viên
                              </h4>
                              <Badge
                                className="bg-[#EC6426] text-white border-0 px-3 py-1"
                                variant="default"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                {user.memberAssociation.name}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {user.memberAssociation.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {user?.id && (
          <div className="w-full max-w-2xl lg:flex-1 lg:max-w-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center lg:justify-start">
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
