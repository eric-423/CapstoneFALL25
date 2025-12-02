"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-lg w-full text-center space-y-8 px-4">
        <div className="space-y-4">
          <div className="text-8xl font-bold text-primary">404</div>
          <h1 className="text-2xl font-bold text-foreground">
            Không tìm thấy trang
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Trang bạn đang tìm kiếm có thể đã bị xóa, thay đổi tên hoặc tạm thời
            không khả dụng.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Về trang chủ
              </Link>
            </Button>

            <Button variant="outline" asChild size="lg">
              <Link href="/menu" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Xem thực đơn
              </Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại trang trước
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Hoặc thử các liên kết phổ biến:
          </h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-primary hover:underline">
              Về chúng tôi
            </Link>
            <Link href="/menu" className="text-primary hover:underline">
              Thực đơn
            </Link>
            <Link href="/login" className="text-primary hover:underline">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
