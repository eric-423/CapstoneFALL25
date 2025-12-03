"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/utils/contexts/AuthContext";
import { AdminProvider } from "@/utils/contexts/AdminContext";
import { BranchesLoader } from "./components/BranchesLoader";
import {
  useBarcodeScanner,
  type BarcodeProcessContext,
} from "@/utils/hooks/useBarcodeScanner";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo, memo, useCallback } from "react";
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  Gift,
  MessageSquare,
  Settings,
  LogOut,
  Package,
  BookOpen,
  GraduationCap,
  Menu,
  X,
  Warehouse,
  Calendar,
  Leaf,
  Flame,
  UtensilsCrossed,
} from "lucide-react";
import logo from "@/assets/logo.png";

const MenuItem = memo(
  ({
    item,
    isActive,
    isCollapsed,
    index,
    totalItems,
  }: {
    item: { href: string; label: string; icon: React.ElementType };
    isActive: boolean;
    isCollapsed: boolean;
    index: number;
    totalItems: number;
  }) => {
    const Icon = item.icon;
    const isFirst = index === 0;
    const isLast = index === totalItems - 1;

    return (
      <Link
        href={item.href}
        prefetch={true}
        className="block"
        title={isCollapsed ? item.label : undefined}
      >
        <div
          className="relative flex items-center"
          style={{ minHeight: "48px" }}
        >
          {!isCollapsed && (
            <>
              <div
                className={`
                            absolute left-[15px] w-[2px] bg-white/30
                            ${isFirst ? "top-1/2" : "top-0"}
                            ${isLast ? "bottom-1/2" : "bottom-0"}
                        `}
              ></div>

              <div className="absolute left-[15px] top-1/2 w-[20px] h-[2px] bg-white/30"></div>

              {!isActive && (
                <div className="absolute left-[11px] top-1/2 -translate-y-1/2 z-10">
                  <div className="w-2 h-2 rounded-full bg-white/50 border-2 border-[#EC6426]/50"></div>
                </div>
              )}
            </>
          )}

          <div
            className={`
                    flex items-center gap-3 py-2.5 sm:py-3 rounded-xl 
                    transition-all duration-150 relative group flex-1
                    ${isCollapsed ? "justify-center px-3" : "px-4 ml-10"}
                    ${isActive
                ? "bg-white/20 text-white shadow-lg font-semibold backdrop-blur-sm"
                : "text-white/80 hover:bg-white/10 hover:text-white"
              }
                `}
          >
            {isActive && isCollapsed && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#F8A91F] rounded-l-full shadow-lg"></div>
            )}

            <Icon
              size={20}
              className={`flex-shrink-0 ${isActive ? "text-white" : "text-white/80 group-hover:text-[#F8A91F]"} transition-colors`}
              strokeWidth={isActive ? 2.5 : 2}
            />
            {!isCollapsed && (
              <>
                <span
                  className={`text-sm sm:text-base ${isActive ? "font-semibold" : "font-medium"} truncate`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-[#F8A91F] rounded-full animate-pulse shadow-lg flex-shrink-0"></div>
                )}
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }
);
MenuItem.displayName = "MenuItem";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuthContext();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Memoize menu items to prevent recreation on every render
  const menuItems = useMemo(() => [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Người dùng', icon: Users },
    { href: '/admin/branches', label: 'Chi nhánh', icon: Store },
    { href: '/admin/warehouses', label: 'Kho', icon: Warehouse },
    { href: '/admin/branches/menu-manager', label: 'Quản lý Menu', icon: Store },
    { href: '/admin/products', label: 'Món ăn', icon: UtensilsCrossed },
    { href: '/admin/materials', label: 'Nguyên liệu', icon: Package },
    { href: '/admin/nutrients', label: 'Dinh dưỡng', icon: Leaf },
    { href: '/admin/cooking-methods', label: 'Phương pháp nấu', icon: Flame },
    { href: '/admin/combos', label: 'Combo', icon: Gift },
    { href: '/admin/training', label: 'Khóa đào tạo', icon: GraduationCap },
    { href: '/admin/schedule', label: 'Lịch trình', icon: Calendar },
    { href: '/admin/orders', label: 'Đơn hàng', icon: ShoppingBag },
    { href: '/admin/finance', label: 'Tài chính', icon: DollarSign },
    { href: '/admin/promotions', label: 'Khuyến mãi', icon: Gift },
    { href: '/admin/feedback', label: 'Phản hồi', icon: MessageSquare },
    { href: '/admin/settings', label: 'Cài đặt', icon: Settings },
  ], []);

  // Calculate active menu index for animated circle
  const activeIndex = useMemo(() => {
    // Find exact match first
    let index = menuItems.findIndex(item => pathname === item.href);

    // If no exact match, find parent route match (for nested routes like /admin/warehouses/1/materials)
    if (index < 0) {
      index = menuItems.findIndex(item =>
        pathname.startsWith(item.href + '/') && item.href !== '/admin'
      );
    }

    return index >= 0 ? index : 0;
  }, [pathname, menuItems]);

  // Check if a menu item is active (exact match or parent route match)
  const isMenuItemActive = useCallback((itemHref: string) => {
    if (pathname === itemHref) return true;
    // Check for nested routes (e.g., /admin/warehouses/1/materials should match /admin/warehouses)
    if (pathname.startsWith(itemHref + '/') && itemHref !== '/admin') return true;
    return false;
  }, [pathname]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!sidebarOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 1024) {
        const target = event.target as HTMLElement;
        if (
          !target.closest("aside") &&
          !target.closest('button[aria-label="Toggle sidebar"]')
        ) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);
  const handleBarcodeSuccess = useCallback(
    (orderId: number, _context?: BarcodeProcessContext) => {
      console.log("Assign chef thành công cho order:", orderId);
    },
    []
  );

  const handleBarcodeError = useCallback((error: Error) => {
    console.error("Lỗi khi assign chef:", error);
  }, []);

  const handleBarcodeAlreadyHandled = useCallback(
    (orderId: number, _context?: BarcodeProcessContext) => {
      console.warn("Chef khác đã nhận order:", orderId);
    },
    []
  );
  useBarcodeScanner({
    enabled: true,
    onSuccess: handleBarcodeSuccess,
    onError: handleBarcodeError,
    onAlreadyHandled: handleBarcodeAlreadyHandled,
  });

  return (
    <AdminProvider>
      <BranchesLoader />
      <div className="min-h-screen bg-[#EFE6DB]">
        <div className="flex relative">
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <aside
            className={`
                        fixed top-0 left-0 h-screen z-50 lg:z-40
                        ${isCollapsed ? "w-20" : "w-64 lg:w-56 xl:w-64"}
                        bg-gradient-to-b from-[#EC6426] via-[#EC6426]/95 to-[#EC6426]/90
                        shadow-xl
                        flex flex-col
                        transition-[width,transform] duration-200 ease-out will-change-[width,transform]
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    `}
          >
            <div className="relative p-2 border-b border-white/20 flex-shrink-0 flex items-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F8A91F]/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 flex-shrink-0">
                <Image src={logo.src} alt="logo" width={100} height={100} />
              </div>

              {!isCollapsed && (
                <div className="relative z-10 flex-1 min-w-0 transition-opacity duration-150">
                  <p className="text-[15px] text-white/100 font-semibold tracking-widest uppercase">
                    Admin Panel
                  </p>
                </div>
              )}

              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-20"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <div className="space-y-1.5 relative">
                {!isCollapsed && (
                  <div
                    className="absolute left-[9.5px] w-3 h-3 rounded-full bg-[#F8A91F] shadow-[0_0_12px_rgba(248,169,31,0.8)] border-2 border-white z-20 pointer-events-none transition-all duration-200 ease-out"
                    style={{
                      top: `${activeIndex * 48 + activeIndex * 6 + 24}px`,
                      transform: "translateY(-50%)",
                    }}
                  ></div>
                )}

                {menuItems.map((item, index) => (
                  <MenuItem
                    key={item.href}
                    item={item}
                    isActive={isMenuItemActive(item.href)}
                    isCollapsed={isCollapsed}
                    index={index}
                    totalItems={menuItems.length}
                  />
                ))}
              </div>
            </nav>
            <div className="p-3 sm:p-4 flex-shrink-0 border-t border-white/20">
              <Button
                variant="outline"
                className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start gap-3"} border-2 border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/50 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl py-2.5 sm:py-3`}
                onClick={handleLogout}
                title={isCollapsed ? "Đăng xuất" : undefined}
              >
                <LogOut size={18} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm sm:text-base font-semibold">
                    Đăng xuất
                  </span>
                )}
              </Button>
            </div>
          </aside>
          <main
            className={`flex-1 w-full bg-[#EFE6DB] min-w-0 transition-[margin] duration-200 ease-out will-change-[margin] ${isCollapsed ? "lg:ml-20" : "lg:ml-56 xl:ml-64"}`}
          >
            <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">
                  TamTech Admin
                </h1>
              </div>
            </div>

            <div className="p-4 sm:p-6 max-w-full overflow-x-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
