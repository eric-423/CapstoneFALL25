"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/utils/hooks";
import { UserAuthData } from "@/utils/types/user.type";
import { useCustomerOrders } from "@/utils/hooks/useCustomerOrders";
import useDocumentTitle from "@/utils/hooks/useDocumentTitle";
import useScrollTop from "@/utils/hooks/useScrollTop";
import { Lock, ShoppingBag, User, Plus, Gift } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import OrderHistorySection from "./sections/order-history-section";
import PasswordChangeSection from "./sections/password-change-section";
import ProfileInfoSection from "./sections/profile-info-section";
import PromotionsSection from "./sections/promotions-section";
import { getMyPromotion, getCustomerDetails } from "@/apis/user.api";
import { useQuery } from "@tanstack/react-query";

export default function ProfileContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && ["profile", "password", "orders", "promotions"].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);
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

    const {
        data: promotionsResponse,
        isLoading: isLoadingPromotions,
    } = useQuery({
        queryKey: ["customer-promotions", user?.id],
        queryFn: () => getMyPromotion(),
        enabled: Boolean(user?.id),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const {
        data: customerDetailsResponse,
        isLoading: isLoadingCustomerDetails,
    } = useQuery({
        queryKey: ["customer-details", user?.id],
        queryFn: () => getCustomerDetails(),
        enabled: Boolean(user?.id),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const promotions = promotionsResponse?.data || [];
    const customerDetails = customerDetailsResponse?.data;

    // Merge user data from auth with customer details from API
    const userData: UserAuthData | null = useMemo(() => {
        if (!user) return null;

        if (customerDetails) {
            return {
                id: user.id,
                phoneNumber: customerDetails.phoneNumber || customerDetails.phone || user.phoneNumber,
                name: customerDetails.name || customerDetails.fullName || user.name || undefined,
                role: user.role,
                memberAssociation: customerDetails.memberAssociation
                    ? {
                        id: customerDetails.memberAssociation.id,
                        point: customerDetails.memberAssociation.point,
                        name: customerDetails.memberAssociation.name,
                        description: customerDetails.memberAssociation.description,
                    }
                    : {
                        id: customerDetails.id || user.memberAssociation?.id || 0,
                        point: customerDetails.point ?? customerDetails.memberPoint ?? user.memberAssociation?.point ?? 0,
                        name: customerDetails.memberRank || user.memberAssociation?.name || '',
                        description: user.memberAssociation?.description || '',
                    },
            };
        }

        return {
            id: user.id,
            phoneNumber: user.phoneNumber,
            name: user.name,
            role: user.role,
            memberAssociation: user.memberAssociation || {
                id: 0,
                point: 0,
                name: '',
                description: '',
            },
        };
    }, [user, customerDetails]);

    const isLoadingUserData = isAuthLoading || isLoadingCustomerDetails;

    // Debug logs để kiểm tra data flow
    useEffect(() => {
        console.log('🔍 Profile Debug:', {
            user,
            customerDetailsResponse,
            customerDetails,
            userData,
            isLoadingCustomerDetails,
        });
    }, [user, customerDetailsResponse, customerDetails, userData, isLoadingCustomerDetails]);





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
        {
            id: "promotions",
            label: "Mã khuyến mãi",
            icon: Gift,
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
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${isActive
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
                        <div className="mb-6 flex flex-col gap-4 items-center text-center lg:flex-row lg:items-start lg:text-left lg:justify-between">
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
                                    className="bg-[#EC6426] hover:bg-[#C04A00] text-white text-base w-full sm:w-auto lg:w-auto justify-center mt-1"
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
                        {activeTab === "promotions" && (
                            <div>
                                <PromotionsSection
                                    promotions={promotions}
                                    isLoading={isLoadingPromotions}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
