"use client";

import { OrderCard } from "@/components/common/card";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { OrderDetailsDialog } from "@/components/common/order-details";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CustomerOrderDetailData,
  OrderResponse,
  getCustomerOrderDetail,
} from "@/apis/order.api";
import { CustomerOrderStatusUpdate } from "@/utils/hooks/useCustomerOrderSocket";
import { CustomerOrderStatus } from "@/utils/hooks/useCustomerOrders";


import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { toast } from "react-toastify";

interface OrderHistorySectionProps {
  orders: OrderResponse[];
  isLoadingOrders?: boolean;
  isFetchingOrders?: boolean;
  isRealtimeConnected?: boolean;
  lastRealtimeUpdate?: CustomerOrderStatusUpdate | null;
  statusFilter: CustomerOrderStatus;
  onStatusChange: (status: CustomerOrderStatus) => void;
}

const ORDER_STATUS_FILTERS: { label: string; value: CustomerOrderStatus }[] = [
  { label: "Tất cả", value: "ALL" },
  { label: "Đã tạo", value: "CREATED" },
  { label: "Đang nấu", value: "COOKING" },
  { label: "Đã nấu xong", value: "COOKED" },
  { label: "Đang xử lý", value: "IN_PROCESS" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Hoàn tất", value: "COMPLETED" },
  { label: "Đã hủy", value: "CANCEL" },
  { label: "Đã thanh toán", value: "PAID" },
];

export default function OrderHistorySection({
  orders,
  isLoadingOrders,
  isFetchingOrders,
  lastRealtimeUpdate,
  statusFilter,
  onStatusChange,
}: OrderHistorySectionProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );
  const [selectedOrderDetail, setSelectedOrderDetail] =
    useState<OrderResponse | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const latestRealtimeTimestamp = lastRealtimeUpdate?.timestamp
    ? new Date(lastRealtimeUpdate.timestamp)
    : null;

  const handleOrderClick = async (order: OrderResponse) => {
    flushSync(() => {
      setSelectedOrder(order);
      setSelectedOrderDetail(null);
      setIsDetailLoading(true);
    });

    try {
      const response = await getCustomerOrderDetail(order.id);
      if (response?.data) {
        const detailOrder = mapCustomerOrderDetail(response.data, order);
        setSelectedOrderDetail(detailOrder);
      } else {
        setSelectedOrderDetail(order);
      }
    } catch (error) {
      console.error("Failed to fetch order detail", error);
      toast.error("Không thể tải chi tiết đơn hàng. Vui lòng thử lại.");
      setSelectedOrderDetail(order);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setSelectedOrderDetail(null);
    setIsDetailLoading(false);
  };

  useEffect(() => {
    if (!selectedOrder) return;
    const updatedOrder = orders.find((order) => order.id === selectedOrder.id);

    if (!updatedOrder) {
      setSelectedOrder(null);
      return;
    }

    if (updatedOrder !== selectedOrder) {
      setSelectedOrder(updatedOrder);
    }
  }, [orders, selectedOrder]);

  const getStatusLabel = (value: CustomerOrderStatus) => {
    const status = ORDER_STATUS_FILTERS.find((s) => s.value === value);
    return status ? status.label : value;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-transparent shadow-none border-0">
        {isLoadingOrders ? (
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <CardHeader>
              <div className="flex flex-col gap-4 items-center text-center lg:flex-row lg:text-left lg:items-center lg:justify-between ">
                <div className="w-full">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Lịch sử đơn hàng
                  </CardTitle>
                  {lastRealtimeUpdate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Cập nhật mới nhất: đơn #{lastRealtimeUpdate.orderId}{" "}
                      {latestRealtimeTimestamp
                        ? `lúc ${latestRealtimeTimestamp.toLocaleTimeString()}`
                        : ""}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 w-full lg:w-auto items-center lg:items-end">
                  <div className="flex w-full sm:w-60">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) =>
                        onStatusChange(value as CustomerOrderStatus)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            {getStatusLabel(statusFilter)}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUS_FILTERS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isFetchingOrders && !isLoadingOrders && (
                  <div className="flex items-center justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <ShoppingBag className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <p className="text-secondary">
                      {statusFilter === "ALL"
                        ? "Bạn chưa có đơn hàng nào"
                        : `Không có đơn hàng nào ${getStatusLabel(statusFilter).toLowerCase()}`}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-7">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-7">
                      {orders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onViewDetails={() => handleOrderClick(order)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </>
        )}
      </Card>

      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrderDetail ?? selectedOrder}
          open={true}
          onClose={handleCloseDialog}
          isLoading={isDetailLoading && !selectedOrderDetail}
        />
      )}
    </div>
  );
}

const mapCustomerOrderDetail = (
  detail: CustomerOrderDetailData,
  fallback?: OrderResponse
): OrderResponse => {
  const fallbackExtended =
    (fallback as OrderResponse & { table?: boolean; pickUp?: boolean; itemCount?: number }) ||
    undefined;

  const detailItems =
    detail.orderItems?.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      note: item.note ?? "",
      price: item.price,
      feedback: item.feedback ?? undefined,
    })) ?? fallback?.items ?? [];

  const computedTotalItems = detailItems.reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0
  );

  const mergedBase: OrderResponse = {
    id: detail.id ?? fallback?.id ?? 0,
    date: detail.createdAt ? new Date(detail.createdAt) : fallback?.date ?? new Date(),
    restaurant: fallback?.restaurant ?? "",
    items: detailItems,
    totalItems:
      Number.isFinite(computedTotalItems) && computedTotalItems >= 0
        ? computedTotalItems
        : fallback?.totalItems ?? detailItems.length,
    subTotal: detail.subTotal ?? fallback?.subTotal ?? 0,
    orderStatus: detail.orderStatus ?? detail.status ?? fallback?.orderStatus ?? "",
    paymentStatus: detail.status ?? fallback?.paymentStatus ?? "",
    customerName:
      detail.customerName ??
      detail.customerDTO?.fullName ??
      fallback?.customerName ??
      "",
    customerPhone: detail.phone ?? detail.customerDTO?.phone ?? fallback?.customerPhone ?? "",
    address: detail.address ?? fallback?.address ?? null,
    branchName: detail.branchName ?? fallback?.branchName,
    branchAddress: detail.branchAddress ?? fallback?.branchAddress,
    shippingFee:
      typeof detail.shippingFee === "number" ? detail.shippingFee : fallback?.shippingFee,
    discountValue:
      detail.discountValue ??
      (typeof detail.discountPercent === "number" ? detail.discountPercent : undefined) ??
      fallback?.discountValue,
    amount: typeof detail.amount === "number" ? detail.amount : fallback?.amount,
    promotionCode: detail.promotionCode ?? fallback?.promotionCode ?? undefined,
    pointUsed:
      typeof detail.pointUsed === "number" ? detail.pointUsed : fallback?.pointUsed,
    pointEarned:
      typeof detail.pointEarned === "number" ? detail.pointEarned : fallback?.pointEarned,
    shipperName: detail.shipperName ?? fallback?.shipperName,
    waiterName: detail.waiterName ?? fallback?.waiterName,
    chefName: detail.chefName ?? fallback?.chefName,
    pickupTime: detail.pickupTime ?? fallback?.pickupTime ?? "",
    payment_code: detail.payment_code ?? fallback?.payment_code,
    orderDate: detail.createdAt ?? fallback?.orderDate,
    paymentTime: fallback?.paymentTime ?? null,
    deliveryAt: detail.delivery_at ?? detail.deliveryAt ?? fallback?.deliveryAt ?? null,
  };

  const extended = mergedBase as OrderResponse & {
    table?: boolean;
    pickUp?: boolean;
    itemCount?: number;
  };

  extended.table = detail.isTable ?? fallbackExtended?.table;
  extended.pickUp = detail.isPickUp ?? fallbackExtended?.pickUp;
  extended.itemCount =
    detail.orderItems?.length ?? fallbackExtended?.itemCount ?? extended.totalItems;

  return extended;
};
