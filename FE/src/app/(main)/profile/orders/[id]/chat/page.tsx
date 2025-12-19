"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { OrderChatPanel } from "@/components/common/order-details/order-chat-panel";
import { getCustomerOrderDetail } from "@/apis/order.api";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { toast } from "react-toastify";

export default function CustomerOrderChatPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);

  const [shipperName, setShipperName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || Number.isNaN(orderId)) {
      toast.error("ID đơn hàng không hợp lệ");
      router.push("/profile?tab=orders");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await getCustomerOrderDetail(orderId);
        const data = response?.data;
        setShipperName(
          data?.shipperName ?? null
        );
      } catch (error) {
        console.error("Failed to load order for chat", error);
        toast.error("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
        router.push("/profile?tab=orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner />
          <p className="text-sm text-gray-600">
            Đang tải phòng chat với shipper...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCF7] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push(`/profile/orders/${orderId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại đơn hàng
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MessageCircle className="h-4 w-4 text-primary" />
            <span>Chat với shipper cho đơn #{orderId}</span>
          </div>
        </div>

        <OrderChatPanel
          orderId={orderId}
          shipperName={shipperName ?? undefined}
        />
      </div>
    </div>
  );
}


