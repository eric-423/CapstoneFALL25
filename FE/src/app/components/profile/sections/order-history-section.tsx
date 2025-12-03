"use client";

import { OrderCard } from "@/components/common/card";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { OrderResponse } from "@/apis/order.api";
import { CustomerOrderStatusUpdate } from "@/utils/hooks/useCustomerOrderSocket";
import { CustomerOrderStatus } from "@/utils/hooks/useCustomerOrders";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

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
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);

  const latestRealtimeTimestamp = lastRealtimeUpdate?.timestamp
    ? new Date(lastRealtimeUpdate.timestamp)
    : null;

  const handleOrderClick = (order: OrderResponse) => {
    router.push(`/profile/orders/${order.id}`);
  };

  const getStatusLabel = (value: CustomerOrderStatus) => {
    const status = ORDER_STATUS_FILTERS.find((s) => s.value === value);
    return status ? status.label : value;
  };
  const totalPages = useMemo(() => {
    return Math.ceil(orders.length / pageSize);
  }, [orders.length, pageSize]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return orders.slice(startIndex, endIndex);
  }, [orders, currentPage, pageSize]);

  const handleStatusChange = (status: CustomerOrderStatus) => {
    setCurrentPage(1);
    onStatusChange(status);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                        handleStatusChange(value as CustomerOrderStatus)
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
                      {paginatedOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onViewDetails={() => handleOrderClick(order)}
                        />
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-muted-foreground">
                          Hiển thị{" "}
                          <span className="font-semibold text-foreground">
                            {(currentPage - 1) * pageSize + 1}
                          </span>
                          {" - "}
                          <span className="font-semibold text-foreground">
                            {Math.min(currentPage * pageSize, orders.length)}
                          </span>
                          {" trong tổng số "}
                          <span className="font-semibold text-foreground">
                            {orders.length}
                          </span>{" "}
                          đơn hàng
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Trước
                          </Button>
                          <div className="flex items-center gap-1 px-3">
                            <span className="text-sm text-muted-foreground">
                              Trang
                            </span>
                            <span className="text-sm font-semibold text-foreground">
                              {currentPage}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              / {totalPages}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1"
                          >
                            Sau
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
