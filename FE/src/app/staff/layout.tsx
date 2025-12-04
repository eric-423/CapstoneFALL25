"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/utils/contexts/AuthContext";
import { AdminProvider } from "@/utils/contexts/AdminContext";
import {
  ProcessOrderFn,
  useBarcodeScanner,
  type BarcodeProcessContext,
} from "@/utils/hooks/useBarcodeScanner";
import {
  assignChefToOrder,
  getBranchOrders,
  completeOrder,
  assignShipperToOrder,
} from "@/apis/order.api";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { toast } from "react-toastify";
import {
  ShoppingBag,
  LogOut,
  Menu,
  X,
  BookOpen,
  Table,
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

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, user } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed] = useState(false);

  const menuItems = useMemo(() => {
    const items = [
      { href: "/staff/orders", label: "Đơn hàng", icon: ShoppingBag },
      { href: "/staff/tables", label: "Bàn ăn", icon: Table },
    ] as const;

    const role = user?.role?.toUpperCase();

    if (role === "WAITER") {
      return items.filter((item) => item.href !== "/staff/orders");
    }

    return items;
  }, [user?.role]);

  const activeIndex = useMemo(() => {
    const index = menuItems.findIndex((item) => pathname === item.href);
    return index >= 0 ? index : 0;
  }, [pathname, menuItems]);

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

  const processScannedOrder = useCallback<ProcessOrderFn>(
    async (orderId: number) => {
      const response = await getBranchOrders();
      const branchOrders = Array.isArray(response?.data) ? response.data : [];
      const order = branchOrders.find((item) => item.id === orderId);

      if (!order) {
        throw new Error(
          `Không tìm thấy đơn hàng #${orderId} trong chi nhánh của bạn.`
        );
      }

      const status = (order.orderStatus || "").toUpperCase();
      const contextBase: BarcodeProcessContext = { status };
      const isPickup = order.isPickUp || order.pickUp;
      const isTable = order.table || order.isTable;


      if (status === 'IN_PROCESS') {
        const assignChef = await assignChefToOrder(orderId);
        if (!assignChef.success) {
          return {
            success: false,
            context: {
              ...contextBase,
              action: "assign-chef" as const,
              message: "Không thể chuyển đơn cho bếp. Vui lòng thử lại.",
            },
          };
        }
        return {
          success: assignChef.success as boolean,
          context: {
            ...contextBase,
            action: "assign-chef" as const,
          },
        };
      }


      if (isPickup && status === "COOKED") {
        const completeResult = await completeOrder(orderId);
        if (!completeResult.success) {
          return {
            success: completeResult.success as boolean,
            context: {
              ...contextBase,
              action: "complete" as const,
              message: "Không thể hoàn thành đơn hàng. Vui lòng thử lại.",
            },
          };
        }
        return {
          success: completeResult.success as boolean,
          context: {
            ...contextBase,
            action: "complete" as const,
          },
        };
      }

      if (status === "COOKED" && !isTable && !isPickup) {
        const assignResult = await assignShipperToOrder(orderId);
        if (!assignResult.success) {
          return {
            success: false,
            context: {
              ...contextBase,
              action: "assign-shipper" as const,
              message: "Không thể giao đơn cho shipper. Vui lòng thử lại.",
            },
          };
        }
        return {
          success: true,
          context: {
            ...contextBase,
            action: "assign-shipper" as const,
          },
        };
      }

      return {
        success: false,
        context: {
          ...contextBase,
          action: "no-action" as const,
          message: `Đơn #${orderId} đang ở trạng thái ${status || "khác"}, không thể xử lý.`,
        },
      };
    },
    []
  );

  const handleBarcodeSuccess = useCallback(
    (orderId: number, context?: BarcodeProcessContext) => {
      if (context?.action === "assign-chef") {
        toast.success(`Đã chuyển đơn #${orderId} cho bếp`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (context?.action === "assign-shipper") {
        toast.success(`Đã bàn giao đơn #${orderId} cho shipper`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.success(`Đã xử lý đơn hàng #${orderId}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }

      window.dispatchEvent(new CustomEvent("refreshOrders"));
    },
    []
  );

  const handleBarcodeError = useCallback((error: Error) => {
    const errorMessage = error.message || "Có lỗi xảy ra khi xử lý đơn";
    toast.error(`Lỗi: ${errorMessage}`, {
      position: "top-right",
      autoClose: 5000,
    });
  }, []);

  const handleBarcodeAlreadyHandled = useCallback(
    (orderId: number, context?: BarcodeProcessContext) => {
      if (context?.action === "no-action") {
        toast.info(
          context?.message ||
          `Đơn #${orderId} đang ở trạng thái ${context?.status || "không xác định"}`,
          {
            position: "top-right",
            autoClose: 4000,
          }
        );
        return;
      }

      toast.warning(`Đơn hàng #${orderId} đã được xử lý trước đó`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
    []
  );

  useBarcodeScanner({
    enabled: true,
    processOrder: processScannedOrder,
    onSuccess: handleBarcodeSuccess,
    onError: handleBarcodeError,
    onAlreadyHandled: handleBarcodeAlreadyHandled,
  });

  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#EFE6DB]">
        <div className="flex relative">
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/15 z-40 lg:hidden transition-opacity"
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
                    {user?.role?.toUpperCase() === "WAITER" ? "Waiter Panel" : "Staff Panel"}
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
                    isActive={pathname === item.href}
                    isCollapsed={isCollapsed}
                    index={index}
                    totalItems={menuItems.length}
                  />
                ))}
              </div>
            </nav>

            <div className="p-3 sm:p-4 flex-shrink-0 border-t border-white/20">
              <Button
                className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start gap-3"} hover:bg-[#EC6426]/90 text-white font-semibold transition-all duration-200 hover:shadow-xl py-2.5 sm:py-3 mb-2`}
                onClick={() => router.push("/staff/training-courses")}
                title={isCollapsed ? "Khóa học của tôi" : undefined}
              >
                <BookOpen size={18} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm sm:text-base font-semibold">
                    Khóa học của tôi
                  </span>
                )}
              </Button>
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
                  TamTech Staff
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
