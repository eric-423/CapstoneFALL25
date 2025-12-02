"use client";

import { ProtectedLayout } from "@/components/layouts/ProtectedLayout";
import { useAuthContext } from "@/utils/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAvailablePromotions } from "@/apis/promotion.api";
import useDocumentTitle from "@/utils/hooks/useDocumentTitle";
import useScrollTop from "@/utils/hooks/useScrollTop";
import AvailableVoucher from "./components/AvailableVoucher";

export default function AvailablePromotionsPage() {
  const { user } = useAuthContext();
  useDocumentTitle("Tấm Tắc | Khuyến mãi khả dụng");
  useScrollTop();

  const { data: promotions = [], isLoading: isLoadingPromotions } = useQuery({
    queryKey: ["available-promotions", user?.id],
    queryFn: () => getAvailablePromotions(),
    enabled: Boolean(user?.id),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AvailableVoucher
            promotions={promotions}
            isLoading={isLoadingPromotions}
          />
        </div>
      </div>
    </ProtectedLayout>
  );
}
