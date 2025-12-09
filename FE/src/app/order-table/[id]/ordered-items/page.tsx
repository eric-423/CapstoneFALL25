"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import useScrollTop from "@/utils/hooks/useScrollTop";
import { getTableById, type TableData } from "@/apis/table.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ShoppingCart, Receipt } from "lucide-react";

export default function OrderedItemsPage() {
  useScrollTop();
  const params = useParams();
  const router = useRouter();
  const tableId = params?.id as string;

  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!tableId) return;
      try {
        const data = await getTableById(tableId);
        setTableData(data);
      } catch (error) {
        console.error("Error fetching table data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [tableId]);

  const orderItems = tableData?.currentOrder?.orderItems || [];
  const subtotal = orderItems.reduce((total, item) => {
    const isCombo = item.comboDTO !== null;
    const price = isCombo ? item.comboDTO?.price || 0 : item.price;
    return total + price * item.quantity;
  }, 0);
  const discount = tableData?.currentOrder?.discountValue || 0;
  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-white h-full">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Món đã đặt</h1>
            <p className="text-gray-600">{tableData?.name || "Bàn"} </p>
            <p className="text-gray-600">
              {tableData?.currentOrder?.customerName
                ? tableData.currentOrder.customerName
                : ""}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/order-table/${tableId}`)}
          >
            Tiếp tục đặt món
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner className="h-8 w-8" />
          </div>
        ) : orderItems.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Receipt className="h-14 w-14 text-gray-300 mx-auto" />
            <p className="text-gray-500">Chưa có món nào được đặt</p>
            <Button onClick={() => router.push(`/order-table/${tableId}`)}>
              Đặt món ngay
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orderItems.map((item, idx) => {
              const isCombo = item.comboDTO !== null;
              const displayName = isCombo
                ? item.comboDTO?.name
                : item.productName;
              const displayImage = isCombo ? null : item.productImg;
              const displayDescription = isCombo
                ? item.comboDTO?.description
                : undefined;
              const displayPrice = isCombo
                ? item.comboDTO?.price || 0
                : item.price;

              return (
                <div
                  key={`${isCombo ? "combo" : "product"}-${
                    isCombo ? item.comboDTO?.id : item.productId
                  }-${idx}`}
                  className={`flex items-start gap-4 p-4 rounded-xl border ${
                    isCombo ? "bg-orange-50 border-orange-200" : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${
                      isCombo
                        ? "bg-gradient-to-br from-orange-100 to-orange-50"
                        : "bg-white"
                    }`}
                  >
                    {displayImage ? (
                      <Image
                        src={displayImage}
                        alt={displayName || ""}
                        fill
                        className="object-cover"
                      />
                    ) : isCombo ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-10 w-10 text-orange-400" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Receipt className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    {isCombo && (
                      <div className="absolute top-1 right-1">
                        <Badge className="bg-orange-500 text-white text-[10px] px-1 py-0">
                          COMBO
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold mb-1 ${
                        isCombo ? "text-orange-700" : "text-gray-900"
                      }`}
                    >
                      {displayName}
                    </h3>
                    {displayDescription && (
                      <p className="text-xs text-gray-600 mb-1">
                        {displayDescription}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mb-2">
                      {displayPrice.toLocaleString()}đ × {item.quantity}
                    </p>
                    {item.note && (
                      <p className="text-xs text-gray-500 italic">
                        Ghi chú: {item.note}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {item.isConfirmed && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 border-green-200"
                        >
                          Đã xác nhận
                        </Badge>
                      )}
                      {item.isDelivered && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          Đã giao
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-semibold text-lg ${
                        isCombo ? "text-orange-600" : "text-primary"
                      }`}
                    >
                      {(displayPrice * item.quantity).toLocaleString()}đ
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {orderItems.length > 0 && (
          <div className="border rounded-xl bg-gray-50 p-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Tạm tính:</span>
              <span className="font-semibold">
                {subtotal.toLocaleString()}đ
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Giảm giá:</span>
                <span>-{discount.toLocaleString()}đ</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Tổng cộng:</span>
              <span className="text-primary">{total.toLocaleString()}đ</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
