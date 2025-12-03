"use client";

import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { useAuthContext } from "@/utils/contexts/AuthContext";
import { AdminProvider } from "@/utils/contexts/AdminContext";
import {
   useBarcodeScanner,
   type BarcodeProcessContext,
} from "@/utils/hooks/useBarcodeScanner";
import {
   assignShipperToOrder,
   completeOrder,
   getBranchOrders,
} from "@/apis/order.api";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { toast } from "react-toastify";
import {
   LayoutDashboard,
   ShoppingBag,
   LogOut,
   Menu,
   X,
   Warehouse,
   BookOpen,
   DollarSign,
   CalendarDays,
} from "lucide-react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { type ProcessOrderFn } from "@/utils/hooks/useBarcodeScanner";

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
               className={`relative flex items-center ${isCollapsed ? "justify-center" : ""
                  }`}
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
                     transition-all duration-200 relative group flex-1
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
                     className={`flex-shrink-0 ${isActive
                        ? "text-white"
                        : "text-white/80 group-hover:text-[#F8A91F]"
                        } transition-colors`}
                     strokeWidth={isActive ? 2.5 : 2}
                  />
                  {!isCollapsed && (
                     <>
                        <span
                           className={`text-sm sm:text-base ${isActive ? "font-semibold" : "font-medium"
                              } truncate`}
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

export default function ManagerLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const { logout } = useAuthContext();
   const router = useRouter();
   const pathname = usePathname();
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [isCollapsed, setIsCollapsed] = useState(false);

   useEffect(() => {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      return () => {
         document.documentElement.style.overflow = "";
         document.body.style.overflow = "";
      };
   }, []);

   const menuItems = useMemo(
      () => [
         { href: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
         { href: "/manager/orders", label: "Đơn hàng", icon: ShoppingBag },
         {
            href: "/manager/schedule",
            label: "Lịch làm việc",
            icon: CalendarDays,
         },
         {
            href: "/manager/warehouses",
            label: "Kho & Nguyên liệu",
            icon: Warehouse,
         },
         { href: "/manager/finance", label: "Tài chính", icon: DollarSign },
      ],
      []
   );

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

   const processScannedOrder = useCallback<ProcessOrderFn>(async (orderId: number) => {
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

      // if (["IN_PROCESS", "PROCESSING"].includes(status)) {
      //   const assignResult = await assignChefToOrder(orderId);
      //   if (!assignResult.success) {
      //     return {
      //       success: false,
      //       context: {
      //         ...contextBase,
      //         action: "assign-chef" as const,
      //         message: "Không thể chuyển đơn cho bếp. Vui lòng thử lại.",
      //       },
      //     };
      //   }
      //   return {
      //     success: true,
      //     context: {
      //       ...contextBase,
      //       action: "assign-chef" as const,
      //     },
      //   };
      // }


      if (isPickup && status === "COOKED") {
         const completeResult = await completeOrder(orderId);
         if (!completeResult.success) {
            return {
               success: completeResult.success as boolean,
               context: {
                  ...contextBase,
                  action: "complete" as const,
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
   }, []);

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
         <div className="h-screen bg-[#EFE6DB] overflow-hidden">
            <div className="flex relative h-full">
               {sidebarOpen && (
                  <div
                     className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                     onClick={() => setSidebarOpen(false)}
                  />
               )}

               <aside
                  className={`
                        fixed top-0 left-0 h-screen z-50 overflow-hidden
                        ${isCollapsed ? "w-20" : "w-64 lg:w-72 xl:w-72"}
                        bg-gradient-to-b from-[#EC6426] via-[#EC6426]/95 to-[#EC6426]/90
                        shadow-xl lg:shadow-none
                        flex flex-col
                        transition-[width,transform] duration-300 ease-in-out
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
                        <div className="relative z-10 flex-1 min-w-0 text-center transition-opacity duration-150">
                           <h2 className="font-bold text-base sm:text-lg lg:text-xl text-white drop-shadow-md">
                              Manager
                           </h2>
                        </div>
                     )}

                     <div className="relative z-10 flex items-center gap-2">
                        <button
                           onClick={() => setIsCollapsed((prev) => !prev)}
                           className="hidden lg:flex p-2 hover:bg-white/10 rounded-lg transition-colors"
                           aria-label={
                              isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"
                           }
                        >
                           {isCollapsed ? (
                              <MenuUnfoldOutlined className="w-4 h-4 text-white" />
                           ) : (
                              <MenuFoldOutlined className="w-4 h-4 text-white" />
                           )}
                        </button>
                        <button
                           onClick={() => setSidebarOpen(false)}
                           className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                           aria-label="Close sidebar"
                        >
                           <X className="w-5 h-5 text-white" />
                        </button>
                     </div>
                  </div>

                  <nav className="flex-1 overflow-hidden p-3 sm:p-4">
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

                  <div className="p-3 sm:p-4 flex-shrink-0 border-t border-white/20 bg-[#EC6426]">
                     <Button
                        className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start gap-3"
                           } hover:bg-[#EC6426]/90 text-white font-semibold transition-all duration-200 hover:shadow-xl py-2.5 sm:py-3 mb-2`}
                        onClick={() => router.push("/manager/training-courses")}
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
                        className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start gap-3"
                           } hover:bg-[#EC6426]/90 text-white font-semibold transition-all duration-200 hover:shadow-xl py-2.5 sm:py-3`}
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

                  <div className="p-3 sm:p-4 bg-black/10 backdrop-blur border-t border-white/20 flex-shrink-0">
                     <p className="text-xs text-center text-white/70 font-medium">
                        © 2025 Tâm Tắc Restaurant
                     </p>
                  </div>
               </aside>

               <main
                  className={`flex-1 w-full bg-[#EFE6DB] min-w-0 transition-[margin] duration-200 ease-out h-screen overflow-y-auto ${isCollapsed ? "lg:ml-12" : "lg:ml-56 xl:ml-64"
                     }`}
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
                           TamTech Manager
                        </h1>
                     </div>
                  </div>
                  <div className="bg-white p-4 sm:p-6 max-w-full overflow-x-hidden">
                     {children}
                  </div>
               </main>
            </div>
         </div>
      </AdminProvider>
   );
}
