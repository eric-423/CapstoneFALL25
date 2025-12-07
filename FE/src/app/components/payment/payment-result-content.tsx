"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import success from "@/assets/images/order_success.png";
import fail from "@/assets/images/fail.png";
import { Home, ShoppingBag, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface PaymentResultContentProps {
  isSuccess?: boolean;
  orderCode?: string | null;
}

export function PaymentResultContent({ isSuccess = true, orderCode }: PaymentResultContentProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];
    setUserRole(role || null);
  }, []);

  return (
    <div className="from-orange-50 to-amber-50 py-8 px-4 md:px-6 bg-[#FFFCF7]">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center w-80 h-80 rounded-full mb-4 ${isSuccess ? "bg-green-100" : "bg-red-100"
              }`}
          >
            {isSuccess ? (
              <div className="w-80 h-80 relative">
                <Image
                  src={success}
                  alt="success"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-80 h-80 relative">
                <Image src={fail} alt="fail" fill className="object-cover" />
              </div>
            )}
          </div>

          <h1
            className={`text-3xl font-bold mb-2 ${isSuccess ? "text-green-700" : "text-red-700"}`}
          >
            {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
          </h1>

          <p className="text-muted-foreground text-lg">
            {isSuccess ? (
              <>Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.</>
            ) : (
              "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại."
            )}
          </p>
        </div>
        <div className="space-y-3">
          {isSuccess ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userRole === "STAFF" || userRole === "WAITER" ? (
                  <Button
                    variant="outline"
                    className="py-3 bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:opacity-90 text-white border-0"
                    onClick={() => router.push("/staff/tables")}
                  >
                    <ClipboardList className="h-6 w-4 mr-2" />
                    Quay về quản lý bàn
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="py-3 bg-black/30 hover:bg-black/70"
                      onClick={() => router.push("/")}
                    >
                      <Home className="h-6 w-4 mr-2" />
                      Về trang chủ
                    </Button>
                    <Button
                      variant="outline"
                      className="py-3 bg-black/30 hover:bg-black/70"
                      onClick={() => router.push("/menu")}
                    >
                      <ShoppingBag className="h-6 w-4 mr-2" />
                      Tiếp tục đặt hàng
                    </Button>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  className="py-3"
                  onClick={() => router.push("/")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Về trang chủ
                </Button>
                {(userRole === "STAFF" || userRole === "WAITER") && (
                  <Button
                    variant="outline"
                    className="py-3 bg-gradient-to-r from-[#EC6426] to-[#F8A91F] text-white border-0"
                    onClick={() => router.push("/staff/tables")}
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Quay về quản lý bàn
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
        <Card
          className="shadow-sm bg-primary/90 mb-20 mt-5 cursor-pointer hover:bg-primary transition-colors"
          onClick={() => {
            if (orderCode) {
              router.push(`/profile/orders/${orderCode}`);
            } else {
              router.push("/profile?tab=orders");
            }
          }}
        >
          <CardContent className=" text-center py-3">
            <p className="text-lg text-white">Theo dõi đơn hàng</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
