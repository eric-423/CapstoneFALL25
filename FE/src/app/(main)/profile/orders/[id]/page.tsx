"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  OrderResponse,
  getCustomerOrderDetail,
  CustomerOrderDetailData,
  completeCustomerOrder,
} from "@/apis/order.api";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { toast } from "react-toastify";
import { ArrowLeft, CheckCircle, MessageCircle } from "lucide-react";
import { OrderDetailsContent } from "@/components/common/order-details";
import { useMemo } from "react";

const mapCustomerOrderDetail = (
  detail: CustomerOrderDetailData,
  fallback?: OrderResponse
): OrderResponse => {
  const fallbackExtended =
    (fallback as OrderResponse & {
      table?: boolean;
      pickUp?: boolean;
      isTable?: boolean;
      isPickUp?: boolean;
      itemCount?: number;
    }) || undefined;

  const detailItems =
    detail.orderItems?.map((item) => {
      const isCombo = item.comboDTO !== null && item.comboDTO !== undefined;

      return {
        productId: item.productId,
        productName:
          isCombo && item.comboDTO
            ? item.comboDTO.name
            : (item.productName ?? "Sản phẩm"),
        quantity: item.quantity,
        note: item.note ?? "",
        price: isCombo && item.comboDTO ? item.comboDTO.price : item.price,
        feedback: item.feedback ?? undefined,
        comboDTO: item.comboDTO ?? null,
        isCombo: isCombo,
      };
    }) ??
    fallback?.items ??
    [];

  const computedTotalItems = detailItems.reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0
  );

  const subTotal = detail.subTotal ?? fallback?.subTotal ?? 0;


  const mergedBase: OrderResponse = {
    id: detail.id ?? fallback?.id ?? 0,
    date: detail.createdAt
      ? new Date(detail.createdAt)
      : (fallback?.date ?? new Date()),
    restaurant: fallback?.restaurant ?? "",
    items: detailItems,
    totalItems:
      Number.isFinite(computedTotalItems) && computedTotalItems >= 0
        ? computedTotalItems
        : (fallback?.totalItems ?? detailItems.length),
    subTotal: subTotal,
    orderStatus:
      detail.orderStatus ?? detail.status ?? fallback?.orderStatus ?? "",
    paymentStatus: detail.status ?? fallback?.paymentStatus ?? "",
    customerName:
      detail.customerName ??
      detail.customerDTO?.fullName ??
      fallback?.customerName ??
      "",
    customerPhone:
      detail.phone ??
      detail.customerDTO?.phone ??
      fallback?.customerPhone ??
      "",
    address: detail.address ?? fallback?.address ?? null,
    branchName: detail.branchName ?? fallback?.branchName,
    branchAddress: detail.branchAddress ?? fallback?.branchAddress,
    shippingFee:
      typeof detail.shippingFee === "number"
        ? detail.shippingFee
        : fallback?.shippingFee,
    discountValue:
      detail.discountValue ??
      (typeof detail.discountPercent === "number"
        ? detail.discountPercent
        : undefined) ??
      fallback?.discountValue,
    amount:
      typeof detail.amount === "number" ? detail.amount : fallback?.amount,
    promotionCode: detail.promotionCode ?? fallback?.promotionCode ?? undefined,
    pointUsed:
      typeof detail.pointUsed === "number"
        ? detail.pointUsed
        : fallback?.pointUsed,
    pointEarned: detail.pointEarned ?? fallback?.pointEarned ?? 0,
    shipperName: detail.shipperName ?? fallback?.shipperName,
    waiterName: detail.waiterName ?? fallback?.waiterName,
    chefName: detail.chefName ?? fallback?.chefName,
    pickupTime: detail.pickupTime ?? fallback?.pickupTime ?? "",
    payment_code: detail.payment_code ?? fallback?.payment_code,
    orderDate: detail.createdAt ?? fallback?.orderDate,
    paymentTime: fallback?.paymentTime ?? null,
    deliveryAt:
      detail.delivery_at ?? detail.deliveryAt ?? fallback?.deliveryAt ?? null,
    paymentUrl: detail.paymentUrl ?? fallback?.paymentUrl ?? null,
    billPdfUrl: detail.billPdfUrl ?? fallback?.billPdfUrl ?? null,
  };

  const extended = mergedBase as OrderResponse & {
    isTable?: boolean;
    isPickUp?: boolean;
    itemCount?: number;
  };

  const isTableValue =
    detail.isTable ?? fallbackExtended?.isTable ?? fallbackExtended?.table;
  const isPickUpValue =
    detail.isPickUp ?? fallbackExtended?.isPickUp ?? fallbackExtended?.pickUp;

  extended.isTable = isTableValue;
  extended.isPickUp = isPickUpValue;
  extended.itemCount =
    detail.orderItems?.length ??
    fallbackExtended?.itemCount ??
    extended.totalItems;

  return extended;
};

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const fetchOrder = useCallback(
    async (showLoading = false) => {
      if (!orderId || isNaN(orderId)) {
        toast.error("ID đơn hàng không hợp lệ");
        router.push("/profile?tab=orders");
        return;
      }

      try {
        if (showLoading) {
          setLoading(true);
        }
        const response = await getCustomerOrderDetail(orderId);
        if (response?.data) {
          const detailOrder = mapCustomerOrderDetail(response.data);
          console.log(detailOrder);
          setOrder(detailOrder);
        } else {
          toast.error("Không tìm thấy đơn hàng");
          router.push("/profile?tab=orders");
        }
      } catch (error) {
        console.error("Failed to load order", error);
        toast.error("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
        router.push("/profile?tab=orders");
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [orderId, router]
  );

  useEffect(() => {
    fetchOrder(true);
  }, [fetchOrder]);

  useEffect(() => {
    refreshIntervalRef.current = setInterval(() => {
      fetchOrder(false);
    }, 10000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchOrder]);

  const paymentAmount = useMemo(() => {
    if (!order) return 0;
    if (order.amount !== undefined && order.amount !== null) {
      return order.amount;
    }
    const subTotal = order.subTotal || 0;
    const shippingFee = order.shippingFee || 0;
    const discountValue = order.discountValue || 0;
    const pointDiscount = (order.pointUsed || 0) * 1000;
    return Math.max(0, subTotal + shippingFee - discountValue - pointDiscount);
  }, [order]);

  const normalizedStatus = order?.orderStatus?.toUpperCase?.() || "";
  const isCreated = normalizedStatus === "CREATED";
  const isDelivered = normalizedStatus === "DELIVERED";
  const canChat =
    normalizedStatus === "SHIPPING" || normalizedStatus === "DELIVERED";

  const handleCompleteOrder = async () => {
    if (!order || isCompleting) return;

    setIsCompleting(true);
    try {
      const result = await completeCustomerOrder(orderId);
      if (result.success) {
        await fetchOrder(false);
      }
    } catch (error) {
      console.error("Error completing order:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner />
          <p className="text-sm text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString("vi-VN")}đ`;
  };

  const redirectToPayment = () => {
    if (!order.paymentUrl) {
      toast.error("Lỗi khi thanh toán");
      return;
    }
    window.location.href = order.paymentUrl;
  };

  return (
    <div className="min-h-screen bg-[#FFFCF7] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#FFFCF7] overflow-hidden">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/profile?tab=orders")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              {canChat && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-primary text-primary"
                  onClick={() => router.push(`/profile/orders/${orderId}/chat`)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              )}
              {isCreated && (
                <Button
                  variant="default"
                  className="w-full sm:w-max bg-primary hover:bg-primary/90 whitespace-nowrap"
                  onClick={redirectToPayment}
                >
                  Tiếp tục thanh toán{" "}
                  <span className="ml-1 font-semibold">
                    ({formatCurrency(paymentAmount)})
                  </span>
                </Button>
              )}
              {isDelivered && (
                <Button
                  variant="default"
                  className="w-full sm:w-max bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                  onClick={handleCompleteOrder}
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    <span className="flex items-center">
                      <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Xác nhận đã nhận hàng
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          <OrderDetailsContent
            order={order}
            isLoading={false}
            onClose={() => router.push("/profile?tab=orders")}
          />
        </div>
      </div>
    </div>
  );
}
