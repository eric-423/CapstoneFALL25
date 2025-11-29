"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ManagerGuard } from "@/components/guards";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    User,
    Phone,
    MapPin,
    Building2,
    Calendar,
    CreditCard,
    Truck,
    ChefHat,
    ArrowLeft,
    CheckCircle,
    Clock,
    XCircle,
    DollarSign,
    Package,
} from "lucide-react";
import {
    getBranchOrders,
    BranchOrderResponse,
    getCustomerOrderDetail,
    CustomerOrderDetailData,
} from "@/apis/order.api";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { toast } from "react-toastify";

const getStatusBadgeClass = (status: string): string => {
    const statusClasses: Record<string, string> = {
        CREATED: "bg-blue-50 text-blue-700 border-blue-200",
        COOKING: "bg-orange-50 text-orange-700 border-orange-200",
        COOKED: "bg-amber-50 text-amber-700 border-amber-200",
        IN_PROCESS: "bg-yellow-50 text-yellow-700 border-yellow-200",
        PROCESSING: "bg-yellow-50 text-yellow-700 border-yellow-200",
        SHIPPING: "bg-indigo-50 text-indigo-700 border-indigo-200",
        DELIVERING: "bg-purple-50 text-purple-700 border-purple-200",
        DELIVERED: "bg-purple-50 text-purple-700 border-purple-200",
        COMPLETED: "bg-green-50 text-green-700 border-green-200",
        CANCELLED: "bg-red-50 text-red-700 border-red-200",
        CANCEL: "bg-red-50 text-red-700 border-red-200",
        PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    return statusClasses[status] || "bg-gray-50 text-gray-700 border-gray-200";
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case "COMPLETED":
            return <CheckCircle size={14} strokeWidth={2.5} />;
        case "COOKING":
        case "COOKED":
            return <Clock size={14} strokeWidth={2.5} />;
        case "IN_PROCESS":
        case "PROCESSING":
            return <Clock size={14} strokeWidth={2.5} />;
        case "SHIPPING":
        case "DELIVERING":
        case "DELIVERED":
            return <Truck size={14} strokeWidth={2.5} />;
        case "CANCELLED":
        case "CANCEL":
            return <XCircle size={14} strokeWidth={2.5} />;
        case "PAID":
            return <DollarSign size={14} strokeWidth={2.5} />;
        default:
            return <Package size={14} strokeWidth={2.5} />;
    }
};

const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
        ALL: "Tất cả",
        CREATED: "Đã tạo",
        COOKING: "Đang nấu",
        COOKED: "Đã nấu xong",
        IN_PROCESS: "Đang xử lý",
        PROCESSING: "Đang xử lý",
        SHIPPING: "Đang giao",
        DELIVERING: "Đang giao hàng",
        DELIVERED: "Đã giao",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy",
        CANCEL: "Đã hủy",
        PAID: "Đã thanh toán",
    };
    return statusMap[status] || status;
};

const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Chưa có";
    try {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "Không hợp lệ";
    }
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
};

async function fetchOrderDetail(orderId: number) {
    const response = await getCustomerOrderDetail(orderId);
    return response?.data ?? null;
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = Number(params.id);

    const [selectedOrder, setSelectedOrder] =
        useState<BranchOrderResponse | null>(null);
    const [orderDetail, setOrderDetail] =
        useState<CustomerOrderDetailData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrder = async () => {
            if (!orderId || isNaN(orderId)) {
                toast.error("ID đơn hàng không hợp lệ");
                router.push("/manager/orders");
                return;
            }

            try {
                setLoading(true);
                const ordersResponse = await getBranchOrders();
                const order = ordersResponse?.data?.find((o) => o.id === orderId);

                if (!order) {
                    toast.error("Không tìm thấy đơn hàng");
                    router.push("/manager/orders");
                    return;
                }

                setSelectedOrder(order);
                const detail = await fetchOrderDetail(orderId);
                setOrderDetail(detail);
            } catch (error) {
                console.error("Failed to load order", error);
                toast.error("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
                router.push("/manager/orders");
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [orderId, router]);

    if (loading) {
        return (
            <ManagerGuard>
                <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <LoadingSpinner />
                        <p className="text-sm text-gray-600">
                            Đang tải chi tiết đơn hàng...
                        </p>
                    </div>
                </div>
            </ManagerGuard>
        );
    }

    if (!selectedOrder) {
        return null;
    }

    return (
        <ManagerGuard>
            <div className="min-h-screen bg-[#FFF9F3] p-4 sm:p-6">
                <div className="max-w-6xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/manager/orders")}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>

                    <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 space-y-6">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-3">
                                    Chi tiết đơn #{selectedOrder.id}
                                    <Badge
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg border-2 ${getStatusBadgeClass(selectedOrder.orderStatus)}`}
                                    >
                                        {getStatusIcon(selectedOrder.orderStatus)}
                                        {getStatusLabel(selectedOrder.orderStatus)}
                                    </Badge>
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Toàn bộ thông tin đơn hàng tại chi nhánh của bạn.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedOrder.isTable && (
                                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 border-2 px-3 py-1 text-xs font-semibold rounded-xl">
                                        Dùng Tại Bàn
                                    </Badge>
                                )}
                                {selectedOrder.isPickUp && (
                                    <Badge className="bg-purple-50 text-purple-700 border-purple-200 border-2 px-3 py-1 text-xs font-semibold rounded-xl">
                                        Giao Hàng
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Thông tin khách hàng
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            <span className="font-semibold">
                                                {orderDetail?.customerName ??
                                                    orderDetail?.customerDTO?.fullName ??
                                                    selectedOrder.customerName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} />
                                            <span>
                                                {orderDetail?.customerDTO?.phone ??
                                                    orderDetail?.phone ??
                                                    selectedOrder.customerPhone}
                                            </span>
                                        </div>
                                        {(orderDetail?.address || selectedOrder.address) && (
                                            <div className="flex items-start gap-2">
                                                <MapPin size={16} className="mt-0.5" />
                                                <span>
                                                    {orderDetail?.address ?? selectedOrder.address}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-2">
                                            <Building2 size={16} className="mt-0.5" />
                                            <span>
                                                {selectedOrder.branchName}
                                                {selectedOrder.branchAddress && (
                                                    <>, {selectedOrder.branchAddress}</>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Thời gian xử lý
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span className="font-semibold">Đặt:</span>
                                            <span>{formatDate(selectedOrder.orderDate)}</span>
                                        </div>
                                        {selectedOrder.paymentTime && (
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={16} />
                                                <span className="font-semibold">Thanh toán:</span>
                                                <span>{formatDate(selectedOrder.paymentTime)}</span>
                                            </div>
                                        )}
                                        {(orderDetail?.delivery_at ||
                                            orderDetail?.deliveryAt ||
                                            selectedOrder.deliveryAt) && (
                                                <div className="flex items-center gap-2">
                                                    <Truck size={16} />
                                                    <span className="font-semibold">Giao:</span>
                                                    <span>
                                                        {formatDate(
                                                            orderDetail?.delivery_at ??
                                                            orderDetail?.deliveryAt ??
                                                            selectedOrder.deliveryAt
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                </Card>
                            </div>

                            {(selectedOrder.waiterName ||
                                selectedOrder.chefName ||
                                selectedOrder.shipperName) && (
                                    <Card className="p-4 border border-gray-100 rounded-xl">
                                        <h3 className="font-semibold text-gray-800 mb-3">
                                            Nhân sự liên quan
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            {selectedOrder.waiterName && (
                                                <div className="flex items-center gap-2">
                                                    <User size={14} />
                                                    <span>
                                                        <span className="font-semibold">Nhân viên:</span>{" "}
                                                        {selectedOrder.waiterName}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedOrder.chefName && (
                                                <div className="flex items-center gap-2">
                                                    <ChefHat size={14} />
                                                    <span>
                                                        <span className="font-semibold">Đầu bếp:</span>{" "}
                                                        {selectedOrder.chefName}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedOrder.shipperName && (
                                                <div className="flex items-center gap-2">
                                                    <Truck size={14} />
                                                    <span>
                                                        <span className="font-semibold">Shipper:</span>{" "}
                                                        {selectedOrder.shipperName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                )}

                            <Card className="p-4 border border-gray-100 rounded-xl">
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Tổng hợp thanh toán
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tổng tiền hàng:</span>
                                        <span className="font-semibold">
                                            {formatCurrency(
                                                orderDetail?.subTotal ?? selectedOrder.subTotal ?? 0
                                            )}
                                        </span>
                                    </div>
                                    {(orderDetail?.shippingFee ?? selectedOrder.shippingFee) !==
                                        undefined &&
                                        (orderDetail?.shippingFee ?? selectedOrder.shippingFee) !==
                                        null && (
                                            <div className="flex justify-between text-gray-600">
                                                <span>Phí vận chuyển:</span>
                                                <span className="font-semibold">
                                                    {formatCurrency(
                                                        orderDetail?.shippingFee ??
                                                        selectedOrder.shippingFee ??
                                                        0
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    {(orderDetail?.discountValue ??
                                        selectedOrder.discountValue) !== undefined &&
                                        (orderDetail?.discountValue ??
                                            selectedOrder.discountValue) !== null && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Giảm giá:</span>
                                                <span className="font-semibold">
                                                    {(orderDetail?.discountValue ??
                                                        selectedOrder.discountValue) === 0
                                                        ? "0đ"
                                                        : `-${formatCurrency(
                                                            orderDetail?.discountValue ??
                                                            selectedOrder.discountValue ??
                                                            0
                                                        )}`}
                                                </span>
                                            </div>
                                        )}
                                    {(orderDetail?.promotionCode ??
                                        selectedOrder.promotionCode) && (
                                            <div className="flex justify-between text-gray-600">
                                                <span>Mã khuyến mãi:</span>
                                                <span className="font-semibold">
                                                    {orderDetail?.promotionCode ??
                                                        selectedOrder.promotionCode}
                                                </span>
                                            </div>
                                        )}
                                    {(orderDetail?.pointUsed ?? selectedOrder.pointUsed) !==
                                        undefined &&
                                        (orderDetail?.pointUsed ?? selectedOrder.pointUsed) !==
                                        null && (
                                            <div className="flex justify-between text-gray-600">
                                                <span>Điểm đã dùng:</span>
                                                <span className="font-semibold">
                                                    {(orderDetail?.pointUsed ??
                                                        selectedOrder.pointUsed) === 0
                                                        ? "0 điểm"
                                                        : `-${(
                                                            orderDetail?.pointUsed ??
                                                            selectedOrder.pointUsed ??
                                                            0
                                                        ).toLocaleString("vi-VN")} điểm`}
                                                </span>
                                            </div>
                                        )}
                                    {(orderDetail?.pointEarned ?? selectedOrder.pointEarned) !==
                                        undefined &&
                                        (orderDetail?.pointEarned ?? selectedOrder.pointEarned) !==
                                        null && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Điểm nhận được:</span>
                                                <span className="font-semibold">
                                                    {(orderDetail?.pointEarned ??
                                                        selectedOrder.pointEarned) === 0
                                                        ? "0 điểm"
                                                        : `+${(
                                                            orderDetail?.pointEarned ??
                                                            selectedOrder.pointEarned ??
                                                            0
                                                        ).toLocaleString("vi-VN")} điểm`}
                                                </span>
                                            </div>
                                        )}
                                    <div className="flex justify-between pt-2 mt-2 border-t-2 border-gray-200">
                                        <span className="font-bold text-base">
                                            Tổng thanh toán:
                                        </span>
                                        <span className="font-bold text-xl text-[#EC6426]">
                                            {formatCurrency(
                                                orderDetail?.amount ?? selectedOrder.amount
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 border border-gray-100 rounded-xl">
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Danh sách món
                                </h3>
                                {orderDetail?.orderItems &&
                                    orderDetail.orderItems.length > 0 ? (
                                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                                        {orderDetail.orderItems.map((item) => (
                                            <div
                                                key={`${item.productId}-${item.note}-${item.price}`}
                                                className="flex items-start justify-between gap-3 border-b border-dashed border-gray-200 pb-3"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm text-gray-900">
                                                        {item.productName}
                                                    </p>
                                                    {item.note && (
                                                        <p className="text-xs text-gray-500 mt-1 bg-gray-100 rounded-lg px-3 py-1 whitespace-pre-line">
                                                            {item.note}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right text-sm">
                                                    <p className="font-semibold text-[#EC6426]">
                                                        {formatCurrency(item.price ?? 0)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        x {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Không có dữ liệu món ăn cho đơn này.
                                    </p>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ManagerGuard>
    );
}