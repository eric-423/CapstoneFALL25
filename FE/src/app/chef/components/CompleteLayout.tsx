"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/utils/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChefHat,
  Clock,
  LogOut,
  User,
  CheckCircle,
  BookOpen,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import logo from "@/assets/full-logo-white.svg";
import RealTimeClock from "./RealTimeClock";

export default function ChefLayout({
  children,
  title = "Khu vực Bếp",
  icon: Icon = ChefHat,
}: {
  children: React.ReactNode;
  title?: string;
  icon?: LucideIcon;
  description?: string;
}) {
  const { logout, user } = useAuthContext();
  const pathname = usePathname();

  const menuItems = [
    { href: "/chef", label: "Danh sách món chờ", icon: Clock },
    { href: "/chef/completed", label: "Đã hoàn thành", icon: CheckCircle },
    { href: "/chef/training-courses", label: "Khóa học", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed left-0 top-0 w-64 h-full bg-[#D97B41] shadow-lg z-50">
        <div className="p-6 border-b border-[#E9C97B]">
          <div className="flex items-center justify-center">
            <Image
              src={logo}
              alt="Tấm Tắc Logo"
              className="max-w-[200px] h-auto"
            />
          </div>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-6 py-3 text-white transition-colors duration-200 ${
                  isActive
                    ? "bg-[#E9C97B] text-[#8D572A] font-semibold"
                    : "hover:bg-[#E9C97B]/50"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#E9C97B]">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-[#D97B41]" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">
                {user?.phoneNumber || "Chef"}
              </p>
              <p className="text-white/70 text-xs">Đầu Bếp</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full text-white hover:bg-[#E9C97B]/50 justify-start"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </div>

      <div className="ml-64">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon className="w-6 h-6 text-[#D97B41] mr-2" />
              <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            </div>
            <RealTimeClock />
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
