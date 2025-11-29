"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  OrderResponse,
  getCustomerOrderDetail,
  CustomerOrderDetailData,
} from "@/apis/order.api";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { OrderDetailsContent } from "@/components/common/order-details";

const mapCustomerOrderDetail = (
  detail: CustomerOrderDetailData,
  fallback?: OrderResponse
): OrderResponse => {
  const fallbackExtended =
    (fallback as OrderResponse & {
      table?: boolean;
      pickUp?: boolean;
      itemCount?: number;
    }) || undefined;

  const detailItems =
    detail.orderItems?.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      note: item.note ?? "",
      price: item.price,
      feedback: item.feedback ?? undefined,
    })) ??
    fallback?.items ??
    [];

  const computedTotalItems = detailItems.reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0
  );

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
    subTotal: detail.subTotal ?? fallback?.subTotal ?? 0,
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
    pointEarned:
      typeof detail.pointEarned === "number"
        ? detail.pointEarned
        : fallback?.pointEarned,
    shipperName: detail.shipperName ?? fallback?.shipperName,
    waiterName: detail.waiterName ?? fallback?.waiterName,
    chefName: detail.chefName ?? fallback?.chefName,
    pickupTime: detail.pickupTime ?? fallback?.pickupTime ?? "",
    payment_code: detail.payment_code ?? fallback?.payment_code,
    orderDate: detail.createdAt ?? fallback?.orderDate,
    paymentTime: fallback?.paymentTime ?? null,
    deliveryAt:
      detail.delivery_at ?? detail.deliveryAt ?? fallback?.deliveryAt ?? null,
  };

  const extended = mergedBase as OrderResponse & {
    table?: boolean;
    pickUp?: boolean;
    itemCount?: number;
  };

  extended.table = detail.isTable ?? fallbackExtended?.table;
  extended.pickUp = detail.isPickUp ?? fallbackExtended?.pickUp;
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

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId || isNaN(orderId)) {
        toast.error("ID đơn hàng không hợp lệ");
        router.push("/profile");
        return;
      }

      try {
        setLoading(true);
        const response = await getCustomerOrderDetail(orderId);
        if (response?.data) {
          const detailOrder = mapCustomerOrderDetail(response.data);
          setOrder(detailOrder);
        } else {
          toast.error("Không tìm thấy đơn hàng");
          router.push("/profile");
        }
      } catch (error) {
        console.error("Failed to load order", error);
        toast.error("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
        router.push("/profile");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, router]);

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

  return (
    <div className="min-h-screen bg-[#FFFCF7] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#FFFCF7] overflow-hidden">
          <Button
            variant="ghost"
            onClick={() => router.push("/profile")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <OrderDetailsContent
            order={order}
            isLoading={false}
            onClose={() => router.push("/profile")}
          />
        </div>
      </div>
    </div>
  );
}
