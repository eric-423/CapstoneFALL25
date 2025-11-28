"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/utils/hooks";
import { useCustomerOrders } from "@/utils/hooks/useCustomerOrders";
import useDocumentTitle from "@/utils/hooks/useDocumentTitle";
import useScrollTop from "@/utils/hooks/useScrollTop";

import { Lock, ShoppingBag, User, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

import OrderHistorySection from "./sections/order-history-section";
import PasswordChangeSection from "./sections/password-change-section";
import ProfileInfoSection from "./sections/profile-info-section";

export default function ProfileContent() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, isLoading: isAuthLoading } = useAuth();
  const addAddressRef = useRef<(() => void) | null>(null);
  useDocumentTitle("Tấm Tắc | Thông tin cá nhân");
  useScrollTop();

  const {
    orders,
    isLoadingOrders,
    isFetchingOrders,
    realtimeStatus,
    isRealtimeConnected,
    statusFilter,
    setStatusFilter,
    totalOrdersCount,
  } = useCustomerOrders({ realtime: true });

  const userData = user;
  const isLoadingUserData = isAuthLoading;

  const totalPoints = orders.reduce(
    (acc, order) => {
      acc.earned +=
        typeof order.pointEarned === "number" ? order.pointEarned : 0;
      acc.used += typeof order.pointUsed === "number" ? order.pointUsed : 0;
      return acc;
    },
    { earned: 0, used: 0 }
  );

  const menuItems = [
    {
      id: "profile",
      label: "Thông tin cá nhân",
      icon: User,
    },
    {
      id: "password",
      label: "Đổi mật khẩu",
      icon: Lock,
    },
    {
      id: "orders",
      label: "Lịch sử đơn hàng",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFCF7] text-base px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:hidden p-4 border-b bg-[#FFFCF7]">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full border-foreground">
              <SelectValue>
                {menuItems
                  .filter((item) => item.id === activeTab)
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-base"
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </div>
                    );
                  })}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SelectItem key={item.id} value={item.id}>
                    <div className="flex items-center gap-2 text-base">
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="hidden lg:block w-64 border-r min-h-screen bg-[#FFFCF7]">
          <div className="">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-base">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="flex-1 bg-[#FFFCF7]">
          <div className="p-0 lg:p-2">
            <div className="mb-6 flex flex-col gap-4 items-center text-center">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Thông tin cá nhân
                </h1>
                <p className="mt-2 text-gray-600 text-base">
                  Quản lý thông tin tài khoản và lịch sử đơn hàng của bạn
                </p>
              </div>
              {activeTab === "profile" && (
                <Button
                  onClick={() => {
                    if (addAddressRef.current) {
                      addAddressRef.current();
                    }
                  }}
                  className="bg-[#EC6426] hover:bg-[#C04A00] text-white text-base w-full sm:w-auto justify-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Thêm địa chỉ mới
                </Button>
              )}
            </div>
            {activeTab === "profile" && (
              <div>
                {userData ? (
                  <ProfileInfoSection
                    isLoading={isLoadingUserData}
                    user={userData}
                    totalOrders={totalOrdersCount || orders.length}
                    totalEarnedPoints={totalPoints.earned}
                    addAddressRef={addAddressRef}
                  />
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-base">
                      Vui lòng đăng nhập để xem thông tin cá nhân
                    </p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "password" && (
              <div>
                <PasswordChangeSection />
              </div>
            )}
            {activeTab === "orders" && (
              <div>
                <OrderHistorySection
                  orders={orders}
                  isLoadingOrders={isLoadingOrders}
                  isFetchingOrders={isFetchingOrders}
                  isRealtimeConnected={isRealtimeConnected}
                  lastRealtimeUpdate={realtimeStatus}
                  statusFilter={statusFilter}
                  onStatusChange={(status) => setStatusFilter(status)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
