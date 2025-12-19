"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { OrderChatPanel } from "@/components/common/order-details/order-chat-panel";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function CustomerOrderChatPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || Number.isNaN(orderId)) {
      router.push("/profile?tab=orders");
      return;
    }

    setLoading(false);
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
        </div>

        <OrderChatPanel
          orderId={orderId}
        />
      </div>
    </div>
  );
}


