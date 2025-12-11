"use client";

import { Montserrat } from "next/font/google";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";

import {
    getOrderStatuses,
    getBranchOrders,
    assignShipperToOrder,
    assignChefToOrder,
    getCustomerOrderDetail,
    BranchOrderResponse,
    CustomerOrderDetailData,
} from "@/apis/order.api";
import {
    AdminPageLayout,
    AdminPageHeader,
    AdminStatsCard,
    AdminStatsGrid,
} from "@/app/admin/components/AdminPageLayout";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ShoppingBag,
    Eye,
    CheckCircle,
    Clock,
    Printer,
    Package,
    Truck,
    XCircle,
    DollarSign,
    User,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    Building2,
    ChefHat,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";

const montserrat = Montserrat({
    subsets: ["latin", "vietnamese"],
    variable: "--font-montserrat",
    display: "swap",
});

const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
        ALL: "Tất cả",
        CREATED: "Đã tạo",
        COOKING: "Đang nấu",
        COOKED: "Đã nấu xong",
        IN_PROCESS: "Đang xử lý",
        PROCESSING: "Đang xử lý",
        SHIPPING: "Đang giao",
        DELIVERING: "Đang giao hàng",
        DELIVERED: "Đã giao",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy",
        CANCEL: "Đã hủy",
        PAID: "Đã thanh toán",
    };
    return statusMap[status] || status;
};

const getStatusBadgeClass = (status: string): string => {
    const statusClasses: Record<string, string> = {
        CREATED: "bg-blue-50 text-blue-700 border-blue-200",
        COOKING: "bg-orange-50 text-orange-700 border-orange-200",
        COOKED: "bg-amber-50 text-amber-700 border-amber-200",
        IN_PROCESS: "bg-yellow-50 text-yellow-700 border-yellow-200",
        PROCESSING: "bg-yellow-50 text-yellow-700 border-yellow-200",
        SHIPPING: "bg-indigo-50 text-indigo-700 border-indigo-200",
        DELIVERING: "bg-purple-50 text-purple-700 border-purple-200",
        DELIVERED: "bg-purple-50 text-purple-700 border-purple-200",
        COMPLETED: "bg-green-50 text-green-700 border-green-200",
        CANCELLED: "bg-red-50 text-red-700 border-red-200",
        CANCEL: "bg-red-50 text-red-700 border-red-200",
        PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    return statusClasses[status] || "bg-gray-50 text-gray-700 border-gray-200";
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case "COMPLETED":
            return <CheckCircle size={14} strokeWidth={2.5} />;
        case "COOKING":
        case "COOKED":
            return <Clock size={14} strokeWidth={2.5} />;
        case "IN_PROCESS":
        case "PROCESSING":
            return <Clock size={14} strokeWidth={2.5} />;
        case "SHIPPING":
        case "DELIVERING":
        case "DELIVERED":
            return <Truck size={14} strokeWidth={2.5} />;
        case "CANCELLED":
        case "CANCEL":
            return <XCircle size={14} strokeWidth={2.5} />;
        case "PAID":
            return <DollarSign size={14} strokeWidth={2.5} />;
        default:
            return <Package size={14} strokeWidth={2.5} />;
    }
};

const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Chưa có";
    try {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "Không hợp lệ";
    }
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
};

const focusBarcodeScanner = () => {
    window.focus();
    document.body.focus();

    const input = document.createElement("input");
    input.style.cssText = "position:fixed;left:-9999px;opacity:0;";
    input.autofocus = true;
    document.body.appendChild(input);
    input.focus();

    const remove = () => input.parentNode && document.body.removeChild(input);
    setTimeout(remove, 6000);

    input.addEventListener("input", (e) => {
        const v = (e.target as HTMLInputElement).value;
        if (v.length > 6) {
            window.dispatchEvent(new CustomEvent("barcodeScanned", { detail: v }));
            remove();
        }
    });
    input.addEventListener("blur", () => setTimeout(() => input.focus(), 100));
};

const fetchAssignToChef = async (orderId: number) => {
    try {
        const assignResult = await assignChefToOrder(orderId);
        return assignResult.success;
    } catch {
        toast.error("Lỗi khi chuyển cho bếp. Vui lòng thử lại.");
        return false;
    }
};

async function fetchOrderDetail(orderId: number) {
    const response = await getCustomerOrderDetail(orderId);
    return response?.data ?? null;
}

type BranchOrdersPageProps = {
    variant: "manager" | "staff";
};

export function BranchOrdersPage({ variant }: BranchOrdersPageProps) {
    const isManager = variant === "manager";
    const isStaff = variant === "staff";
    const router = useRouter();

    const [orderStatuses, setOrderStatuses] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
    const [orderTypeFilter, setOrderTypeFilter] = useState<string>("ALL");
    const [orders, setOrders] = useState<BranchOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState("id");
    const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
    const [assigningShipper, setAssigningShipper] = useState<Set<number>>(
        new Set()
    );
    const [selectedOrder, setSelectedOrder] =
        useState<BranchOrderResponse | null>(null);
    const [orderDetail, setOrderDetail] =
        useState<CustomerOrderDetailData | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const autoPrintedOrdersRef = useRef<Set<number>>(new Set());

    const handlePrint = useCallback(async (order: BranchOrderResponse) => {
        try {
            const blob = await downloadInvoiceBlob(order.id);
            await printBlobInBrowser(blob);
            if (order.orderStatus === "IN_PROCESS") await fetchAssignToChef(order.id);
        } catch {
            toast.error("Lỗi in hóa đơn. Vui lòng thử lại.");
        }
    }, []);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await getOrderStatuses();
                if (
                    response &&
                    response.status === 0 &&
                    response.data &&
                    Array.isArray(response.data)
                ) {
                    setOrderStatuses(
                        response.data.filter((status) => status.toUpperCase() !== "PAID")
                    );
                } else {
                    setOrderStatuses([
                        "ALL",
                        "CREATED",
                        "IN_PROCESS",
                        "DELIVERING",
                        "COMPLETED",
                        "CANCELLED",
                    ]);
                }
            } catch (error) {
                console.error("Error fetching order statuses:", error);
                setOrderStatuses([
                    "ALL",
                    "CREATED",
                    "IN_PROCESS",
                    "DELIVERING",
                    "COMPLETED",
                    "CANCELLED",
                ]);
            }
        };
        fetchStatuses();
    }, []);

    const fetchOrders = useCallback(async () => {
        try {
            const status = selectedStatus === "ALL" ? undefined : selectedStatus;
            const response = await getBranchOrders(status);
            if (
                response &&
                response.status === 0 &&
                response.data &&
                Array.isArray(response.data)
            ) {
                const responseOrders = response.data;
                setOrders(responseOrders);

                responseOrders
                    .filter((order) => order.orderStatus === "IN_PROCESS")
                    .forEach((order) => {
                        if (!autoPrintedOrdersRef.current.has(order.id)) {
                            autoPrintedOrdersRef.current.add(order.id);
                            void handlePrint(order);
                        }
                        autoPrintedOrdersRef.current.clear();
                    });
            } else {
                setOrders([]);
            }
        } catch (error: unknown) {
            console.error("Error fetching branch orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [selectedStatus, handlePrint]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    useEffect(() => {
        const handleRefreshOrders = () => {
            fetchOrders();
        };

        window.addEventListener("refreshOrders", handleRefreshOrders);
        return () => {
            window.removeEventListener("refreshOrders", handleRefreshOrders);
        };
    }, [fetchOrders]);

    const handleAssignShipper = async (orderId: number) => {
        if (assigningShipper.has(orderId)) {
            return;
        }

        setAssigningShipper((prev) => new Set(prev).add(orderId));

        try {
            const result = await assignShipperToOrder(orderId);

            if (result.success) {
                await fetchOrders();
            } else {
                toast.error("Không thể assign shipper. Vui lòng thử lại.");
            }
        } catch {
            toast.error("Lỗi khi chuyển cho shipper. Vui lòng thử lại.");
        } finally {
            setAssigningShipper((prev) => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });
        }
    };

    const handleViewOrderDetail = async (order: BranchOrderResponse) => {
        if (isManager) {
            router.push(`/manager/orders/${order.id}`);
            return;
        }

        flushSync(() => {
            setSelectedOrder(order);
            setOrderDetail(null);
            setDetailLoading(true);
        });

        try {
            const detail = await fetchOrderDetail(order.id);
            setOrderDetail(detail);
        } catch (error) {
            console.error("Failed to fetch order detail", error);
            toast.error("Không thể tải chi tiết đơn hàng. Vui lòng thử lại.");
        } finally {
            setDetailLoading(false);
        }
    };

    const downloadInvoiceBlob = async (orderId: number) => {
        const response = await fetch(`/api/orders/${orderId}/bill/download`, {
            credentials: "include",
        });
        if (!response.ok) throw new Error("Không lấy được invoice");
        return response.blob();
    };

    const printBlobInBrowser = async (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const iframe = document.createElement("iframe");
        iframe.style.cssText =
            "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;";
        iframe.src = url;
        document.body.appendChild(iframe);

        const onloadDelay = 3;
        const fallbackDelay = 100;
        const scannerRefocusDelay = 200;

        let cleaned = false;
        let hasTriggeredPrint = false;
        let onloadTriggerTimeout: ReturnType<typeof setTimeout> | null = null;
        let fallbackTriggerTimeout: ReturnType<typeof setTimeout> | null = null;

        const cleanup = () => {
            if (cleaned) return;
            cleaned = true;
            if (onloadTriggerTimeout) {
                clearTimeout(onloadTriggerTimeout);
                onloadTriggerTimeout = null;
            }
            if (fallbackTriggerTimeout) {
                clearTimeout(fallbackTriggerTimeout);
                fallbackTriggerTimeout = null;
            }
            iframe.contentWindow?.removeEventListener("afterprint", afterPrint);
            window.removeEventListener("afterprint", afterPrint);
            document.removeEventListener("visibilitychange", onVisible);
            if (iframe.parentNode) document.body.removeChild(iframe);
            URL.revokeObjectURL(url);
        };

        const triggerPrint = () => {
            if (hasTriggeredPrint) return;
            const win = iframe.contentWindow;
            if (!win) return;
            hasTriggeredPrint = true;

            if (onloadTriggerTimeout) {
                clearTimeout(onloadTriggerTimeout);
                onloadTriggerTimeout = null;
            }

            if (fallbackTriggerTimeout) {
                clearTimeout(fallbackTriggerTimeout);
                fallbackTriggerTimeout = null;
            }

            focusBarcodeScanner();
            win.focus();

            win.print();

            setTimeout(focusBarcodeScanner, scannerRefocusDelay);
        };

        const onVisible = () => {
            if (document.visibilityState === "visible") {
                focusBarcodeScanner();
                document.removeEventListener("visibilitychange", onVisible);
            }
        };

        const afterPrint = (): void => {
            focusBarcodeScanner();
            cleanup();
        };

        document.addEventListener("visibilitychange", onVisible);
        iframe.onload = () => {
            iframe.contentWindow?.addEventListener("afterprint", afterPrint);
            onloadTriggerTimeout = setTimeout(triggerPrint, onloadDelay);
        };

        fallbackTriggerTimeout = setTimeout(() => {
            if (!hasTriggeredPrint) {
                triggerPrint();
            }
        }, fallbackDelay);

        setTimeout(cleanup, 5000);
        window.addEventListener("afterprint", afterPrint);
    };

    const filteredOrders = useMemo(() => {
        let filtered = orders;

        if (selectedStatus !== "ALL") {
            filtered = filtered.filter(
                (order) => order.orderStatus === selectedStatus
            );
        }

        if (orderTypeFilter !== "ALL") {
            filtered = filtered.filter((order) => {
                const isPickUp = order.pickUp;
                const isTable = order.table;

                switch (orderTypeFilter) {
                    case "PICKUP":
                        return isPickUp === true;
                    case "TABLE":
                        return isTable === true;
                    case "DELIVERY":
                        return !isPickUp && !isTable;
                    default:
                        return true;
                }
            });
        }

        if (searchKeyword) {
            const keyword = searchKeyword.toLowerCase();
            filtered = filtered.filter(
                (order) =>
                    order.id.toString().includes(keyword) ||
                    order.customerName?.toLowerCase().includes(keyword) ||
                    order.customerPhone?.toLowerCase().includes(keyword) ||
                    order.address?.toLowerCase().includes(keyword)
            );
        }

        filtered = [...filtered].sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortBy) {
                case "id":
                    aValue = a.id;
                    bValue = b.id;
                    break;
                case "customerName":
                    aValue = a.customerName || "";
                    bValue = b.customerName || "";
                    break;
                case "amount":
                    aValue = a.amount;
                    bValue = b.amount;
                    break;
                case "orderDate":
                    aValue = new Date(a.orderDate || 0).getTime();
                    bValue = new Date(b.orderDate || 0).getTime();
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortDirection === "ASC" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "ASC" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [
        orders,
        selectedStatus,
        orderTypeFilter,
        searchKeyword,
        sortBy,
        sortDirection,
    ]);

    const paginatedOrders = useMemo(() => {
        const start = currentPage * pageSize;
        const end = start + pageSize;
        return filteredOrders.slice(start, end);
    }, [filteredOrders, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredOrders.length / pageSize);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
        } else {
            setSortBy(column);
            setSortDirection("ASC");
        }
        setCurrentPage(0);
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) {
            return (
                <div className="flex flex-col -space-y-1">
                    <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </div>
            );
        }
        return sortDirection === "ASC" ? (
            <ChevronUp className="h-3.5 w-3.5 text-[#EC6426]" />
        ) : (
            <ChevronDown className="h-3.5 w-3.5 text-[#EC6426]" />
        );
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleClearFilters = () => {
        setSearchKeyword("");
        setSelectedStatus("ALL");
        setOrderTypeFilter("ALL");
        setCurrentPage(0);
    };

    const stats = useMemo(() => {
        const total = filteredOrders.length;
        const inProcess = filteredOrders.filter((o) =>
            ["IN_PROCESS", "PROCESSING", "COOKING", "COOKED"].includes(o.orderStatus)
        ).length;
        const delivering = filteredOrders.filter((o) =>
            ["DELIVERING", "SHIPPING", "DELIVERED"].includes(o.orderStatus)
        ).length;
        const completed = filteredOrders.filter(
            (o) => o.orderStatus === "COMPLETED"
        ).length;
        const totalRevenue = filteredOrders
            .filter(
                (o) =>
                    o.orderStatus !== "CANCELLED" &&
                    o.orderStatus !== "CANCEL" &&
                    o.orderStatus !== "CREATED"
            )
            .reduce((sum, o) => sum + o.amount, 0);
        return { total, inProcess, delivering, completed, totalRevenue };
    }, [filteredOrders]);

    const shouldShowInitialLoader = loading && orders.length === 0;
    const shouldShowEmptyState =
        !shouldShowInitialLoader && filteredOrders.length === 0;

    return (
        <>
            <div className={`${montserrat.className} px-3`}>
                <AdminPageLayout>
                    <AdminPageHeader title="Quản Lý Đơn Hàng" icon={ShoppingBag} />

                    <AdminStatsGrid>
                        <AdminStatsCard
                            title="Tổng đơn hàng"
                            value={stats.total}
                            icon={ShoppingBag}
                        />
                        <AdminStatsCard
                            title="Đang xử lý"
                            value={stats.inProcess}
                            icon={Clock}
                            className="border-yellow-200"
                        />
                        <AdminStatsCard
                            title="Hoàn thành"
                            value={stats.completed}
                            icon={CheckCircle}
                            className="border-green-200"
                        />
                        <AdminStatsCard
                            title="Tổng doanh thu"
                            value={formatCurrency(stats.totalRevenue)}
                            icon={DollarSign}
                            className="border-[#F8A91F]/20"
                        />
                    </AdminStatsGrid>

                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white backdrop-blur-sm border-gray-300 border shadow-sm rounded-xl">
                        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
                                <Input
                                    placeholder="Tìm kiếm đơn hàng..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    className="w-full max-w-[250px] pl-10 pr-4 py-2 border bg-white/80 border-[#EC6426]/30 rounded-lg text-sm focus:border-[#EC6426] focus:ring-1 focus:ring-[#EC6426]/20 outline-none"
                                />
                            </div>
                            <FilterDropdown
                                label="Tất cả trạng thái"
                                title="Lọc theo trạng thái"
                                value={selectedStatus}
                                onChange={(value) => {
                                    setSelectedStatus(value);
                                    setCurrentPage(0);
                                }}
                                items={orderStatuses.map((status) => ({
                                    value: status,
                                    label: getStatusLabel(status),
                                }))}
                                showAllOption={false}
                                className="w-[150px]"
                            />
                            {(isManager || isStaff) && (
                                <FilterDropdown
                                    label="Loại đơn"
                                    title="Lọc theo loại đơn"
                                    value={orderTypeFilter}
                                    onChange={(value) => {
                                        setOrderTypeFilter(value);
                                        setCurrentPage(0);
                                    }}
                                    items={[
                                        { value: "ALL", label: "Tất cả" },
                                        { value: "PICKUP", label: "Nhận tại quán" },
                                        { value: "TABLE", label: "Dùng tại bàn" },
                                        { value: "DELIVERY", label: "Giao hàng" },
                                    ]}
                                    showAllOption={false}
                                    className="w-[150px]"
                                />
                            )}
                            {(searchKeyword ||
                                selectedStatus !== "ALL" ||
                                orderTypeFilter !== "ALL") && (
                                    <Button onClick={handleClearFilters} variant="ghost" size="sm">
                                        <X className="h-4 w-4 mr-1" />
                                        Xóa lọc
                                    </Button>
                                )}
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-sm text-[#2D1E1A] font-medium whitespace-nowrap">
                                Hiển thị:
                            </label>
                            <FilterDropdown
                                label="Hiển thị"
                                title="Số lượng hiển thị"
                                value={pageSize.toString()}
                                onChange={(value) => {
                                    setPageSize(parseInt(value));
                                    setCurrentPage(0);
                                }}
                                items={[
                                    { value: "5", label: "5" },
                                    { value: "10", label: "10" },
                                    { value: "20", label: "20" },
                                    { value: "50", label: "50" },
                                ]}
                                showAllOption={false}
                                className="w-[80px]"
                            />
                            <span className="text-sm text-[#2D1E1A]/80 whitespace-nowrap">
                                Tổng:{" "}
                                <span className="font-bold text-[#EC6426]">
                                    {filteredOrders.length}
                                </span>
                            </span>
                        </div>
                    </div>

                    <Card className="overflow-hidden py-0">
                        {shouldShowInitialLoader ? (
                            <div className="p-12 text-center text-[#2D1E1A]/70">
                                <div className="w-12 h-12 border-4 border-[#EBD187] border-t-[#EC6426] rounded-full animate-spin mx-auto mb-4"></div>
                                <p>Đang tải danh sách đơn hàng...</p>
                            </div>
                        ) : shouldShowEmptyState ? (
                            <div className="p-12 text-center text-[#2D1E1A]/70">
                                <Package className="h-16 w-16 mx-auto mb-4 text-[#EC6426]/30" />
                                <p className="font-semibold">Không tìm thấy đơn hàng nào</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Thử chọn trạng thái khác để xem thêm đơn hàng
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-center">
                                        <thead className="bg-white border-b-2 border-grey-300">
                                            <tr>
                                                <th
                                                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                                                    onClick={() => handleSort("id")}
                                                >
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        ID
                                                        {getSortIcon("id")}
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                                                    onClick={() => handleSort("customerName")}
                                                >
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        Khách hàng
                                                        {getSortIcon("customerName")}
                                                    </div>
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A]">
                                                    Trạng thái
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A]">
                                                    Loại đơn
                                                </th>
                                                <th
                                                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                                                    onClick={() => handleSort("amount")}
                                                >
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        Tổng tiền
                                                        {getSortIcon("amount")}
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                                                    onClick={() => handleSort("orderDate")}
                                                >
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        Ngày đặt
                                                        {getSortIcon("orderDate")}
                                                    </div>
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A]">
                                                    Thao tác
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#EC6426]/10">
                                            {paginatedOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-[#EBD187]/10 transition-colors"
                                                >
                                                    <td className="px-4 py-3 text-sm font-semibold text-[#2D1E1A]">
                                                        #{order.id}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-col items-start text-left">
                                                            <span className="text-sm font-semibold text-[#2D1E1A]">
                                                                {order.customerName}
                                                            </span>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Phone size={12} className="text-gray-400" />
                                                                <span className="text-xs text-gray-500">
                                                                    {order.customerPhone}
                                                                </span>
                                                            </div>
                                                            {order.address && (
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <MapPin size={12} className="text-gray-400" />
                                                                    <span className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                                                                        {order.address}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge
                                                            className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-bold rounded-lg border ${getStatusBadgeClass(
                                                                order.orderStatus
                                                            )}`}
                                                        >
                                                            {getStatusIcon(order.orderStatus)}
                                                            {getStatusLabel(order.orderStatus)}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-wrap gap-1 justify-center">
                                                            {(order.isTable === true ||
                                                                order.table === true) && (
                                                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 border px-2 py-0.5 text-xs font-bold rounded-lg">
                                                                        Tại bàn
                                                                    </Badge>
                                                                )}
                                                            {(order.isPickUp === true ||
                                                                order.pickUp === true) && (
                                                                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 border px-2 py-0.5 text-xs font-bold rounded-lg">
                                                                        Nhận tại quán
                                                                    </Badge>
                                                                )}
                                                            {!order.isTable &&
                                                                !order.isPickUp &&
                                                                !order.table &&
                                                                !order.pickUp && (
                                                                    <Badge className="bg-green-100 text-green-700 border-green-200 border px-2 py-0.5 text-xs font-bold rounded-lg">
                                                                        <Truck size={10} className="mr-1 inline" />
                                                                        Giao hàng
                                                                    </Badge>
                                                                )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-right">
                                                            <span className="text-sm font-bold text-[#EC6426]">
                                                                {formatCurrency(order.amount)}
                                                            </span>
                                                            {order.discountValue > 0 && (
                                                                <div className="text-xs text-green-600 mt-0.5">
                                                                    Giảm: {formatCurrency(order.discountValue)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-[#2D1E1A]">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-xs">
                                                                {formatDate(order.orderDate)}
                                                            </span>
                                                            {order.paymentTime && (
                                                                <span className="text-xs text-gray-500 mt-1">
                                                                    Thanh toán: {formatDate(order.paymentTime)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {order.orderStatus === "COOKED" &&
                                                                !(
                                                                    order.isPickUp ||
                                                                    order.pickUp ||
                                                                    order.isTable ||
                                                                    order.table
                                                                ) && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleAssignShipper(order.id)
                                                                        }
                                                                        disabled={assigningShipper.has(order.id)}
                                                                        className="text-green-600 border-green-500 hover:bg-green-500 hover:text-white transition-all"
                                                                        title="Giao hàng ngay"
                                                                    >
                                                                        <Truck size={14} strokeWidth={2.5} />
                                                                    </Button>
                                                                )}
                                                            {["IN_PROCESS", "COOKED"].includes(
                                                                order.orderStatus
                                                            ) && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handlePrint(order)}
                                                                        className="text-[#EC6426] border-[#EC6426] hover:bg-[#EC6426] hover:text-white transition-all"
                                                                        title="In hóa đơn"
                                                                    >
                                                                        <Printer size={14} strokeWidth={2.5} />
                                                                    </Button>
                                                                )}
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-[#EC6426] border-[#EC6426]/30 hover:bg-[#EC6426]/10 transition-all"
                                                                onClick={() => handleViewOrderDetail(order)}
                                                                title="Xem chi tiết"
                                                            >
                                                                <Eye size={14} strokeWidth={2.5} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 1 && (
                                    <div className="px-4 py-3 border-t border-[#EC6426]/20 bg-gradient-to-r from-[#EBD187]/10 to-[#EC6426]/5">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-[#2D1E1A]/80">
                                                Trang{" "}
                                                <span className="font-semibold">{currentPage + 1}</span>{" "}
                                                / {totalPages} (Hiển thị {paginatedOrders.length} /{" "}
                                                {filteredOrders.length} đơn hàng)
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 0}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-[#EC6426]/30 text-[#2D1E1A] hover:bg-[#EC6426]/10"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    Trước
                                                </Button>
                                                <Button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage >= totalPages - 1}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-[#EC6426]/30 text-[#2D1E1A] hover:bg-[#EC6426]/10"
                                                >
                                                    Sau
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </Card>
                </AdminPageLayout>
            </div>

            {isStaff && (
                <Dialog
                    open={!!selectedOrder}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setSelectedOrder(null);
                            setOrderDetail(null);
                            setDetailLoading(false);
                        }
                    }}
                >
                    <DialogContent className="w-[90vw] sm:w-[90vw] lg:w-[50vw] max-w-[95vw] sm:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto bg-[#FFF9F3] rounded-3xl border-none p-4 sm:p-6 shadow-[0_20px_50px_rgba(12,21,55,0.2)]">
                        {detailLoading && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/70 rounded-3xl">
                                <LoadingSpinner />
                                <p className="text-sm text-gray-600">
                                    Đang tải chi tiết đơn hàng...
                                </p>
                            </div>
                        )}
                        {selectedOrder && (
                            <div className="space-y-6">
                                <DialogHeader>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                                Chi tiết đơn #{selectedOrder.id}
                                                <Badge
                                                    className={`px-3 py-1 text-xs font-semibold rounded-lg border-2 ${getStatusBadgeClass(
                                                        selectedOrder.orderStatus
                                                    )}`}
                                                >
                                                    {getStatusIcon(selectedOrder.orderStatus)}
                                                    {getStatusLabel(selectedOrder.orderStatus)}
                                                </Badge>
                                            </DialogTitle>
                                            <DialogDescription>
                                                Toàn bộ thông tin đơn hàng tại chi nhánh của bạn.
                                            </DialogDescription>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedOrder.isTable && (
                                                <Badge className="bg-blue-50 text-blue-700 border-blue-200 border-2 px-3 py-1 text-xs font-semibold rounded-xl">
                                                    Tại bàn
                                                </Badge>
                                            )}
                                            {selectedOrder.isPickUp && (
                                                <Badge className="bg-purple-50 text-purple-700 border-purple-200 border-2 px-3 py-1 text-xs font-semibold rounded-xl">
                                                    Nhận tại quán
                                                </Badge>
                                            )}
                                            {!selectedOrder.isTable && !selectedOrder.isPickUp && (
                                                <Badge className="bg-green-50 text-green-700 border-green-200 border-2 px-3 py-1 text-xs font-semibold rounded-xl flex items-center gap-1">
                                                    <Truck size={12} />
                                                    Giao hàng
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </DialogHeader>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                            <h3 className="font-semibold text-gray-800 mb-3">
                                                Thông tin khách hàng
                                            </h3>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} />
                                                    <span className="font-semibold">
                                                        {orderDetail?.customerName ??
                                                            orderDetail?.customerDTO?.fullName ??
                                                            selectedOrder.customerName}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={16} />
                                                    <span>
                                                        {orderDetail?.customerDTO?.phone ??
                                                            orderDetail?.phone ??
                                                            selectedOrder.customerPhone}
                                                    </span>
                                                </div>
                                                {(orderDetail?.address || selectedOrder.address) && (
                                                    <div className="flex items-start gap-2">
                                                        <MapPin size={16} className="mt-0.5" />
                                                        <span>
                                                            {orderDetail?.address ?? selectedOrder.address}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-start gap-2">
                                                    <Building2 size={16} className="mt-0.5" />
                                                    <span>
                                                        {selectedOrder.branchName}
                                                        {selectedOrder.branchAddress && (
                                                            <>, {selectedOrder.branchAddress}</>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                            <h3 className="font-semibold text-gray-800 mb-3">
                                                Thời gian xử lý
                                            </h3>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    <span className="font-semibold">Đặt:</span>
                                                    <span>{formatDate(selectedOrder.orderDate)}</span>
                                                </div>
                                                {selectedOrder.paymentTime && (
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard size={16} />
                                                        <span className="font-semibold">Thanh toán:</span>
                                                        <span>{formatDate(selectedOrder.paymentTime)}</span>
                                                    </div>
                                                )}
                                                {(orderDetail?.delivery_at ||
                                                    orderDetail?.deliveryAt ||
                                                    selectedOrder.deliveryAt) && (
                                                        <div className="flex items-center gap-2">
                                                            <Truck size={16} />
                                                            <span className="font-semibold">Giao:</span>
                                                            <span>
                                                                {formatDate(
                                                                    orderDetail?.delivery_at ??
                                                                    orderDetail?.deliveryAt ??
                                                                    selectedOrder.deliveryAt
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        </Card>
                                    </div>

                                    {(selectedOrder.waiterName ||
                                        selectedOrder.chefName ||
                                        selectedOrder.shipperName) && (
                                            <Card className="p-4 border border-gray-100 rounded-xl">
                                                <h3 className="font-semibold text-gray-800 mb-3">
                                                    Nhân sự liên quan
                                                </h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    {selectedOrder.waiterName && (
                                                        <div className="flex items-center gap-2">
                                                            <User size={14} />
                                                            <span>
                                                                <span className="font-semibold">Nhân viên:</span>{" "}
                                                                {selectedOrder.waiterName}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {selectedOrder.chefName && (
                                                        <div className="flex items-center gap-2">
                                                            <ChefHat size={14} />
                                                            <span>
                                                                <span className="font-semibold">Đầu bếp:</span>{" "}
                                                                {selectedOrder.chefName}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {selectedOrder.shipperName && (
                                                        <div className="flex items-center gap-2">
                                                            <Truck size={14} />
                                                            <span>
                                                                <span className="font-semibold">Shipper:</span>{" "}
                                                                {selectedOrder.shipperName}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        )}

                                    <Card className="p-4 border border-gray-100 rounded-xl">
                                        <h3 className="font-semibold text-gray-800 mb-3">
                                            Tổng hợp thanh toán
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Tổng tiền hàng:</span>
                                                <span className="font-semibold">
                                                    {formatCurrency(
                                                        orderDetail?.subTotal ?? selectedOrder.subTotal ?? 0
                                                    )}
                                                </span>
                                            </div>
                                            {(orderDetail?.shippingFee ??
                                                selectedOrder.shippingFee) !== undefined &&
                                                (orderDetail?.shippingFee ??
                                                    selectedOrder.shippingFee) !== null && (
                                                    <div className="flex justify-between text-gray-600">
                                                        <span>Phí vận chuyển:</span>
                                                        <span className="font-semibold">
                                                            {formatCurrency(
                                                                orderDetail?.shippingFee ??
                                                                selectedOrder.shippingFee ??
                                                                0
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            {(orderDetail?.discountValue ??
                                                selectedOrder.discountValue) !== undefined &&
                                                (orderDetail?.discountValue ??
                                                    selectedOrder.discountValue) !== null && (
                                                    <div className="flex justify-between text-green-600">
                                                        <span>Giảm giá:</span>
                                                        <span className="font-semibold">
                                                            {(orderDetail?.discountValue ??
                                                                selectedOrder.discountValue) === 0
                                                                ? "0đ"
                                                                : `-${formatCurrency(
                                                                    orderDetail?.discountValue ??
                                                                    selectedOrder.discountValue ??
                                                                    0
                                                                )}`}
                                                        </span>
                                                    </div>
                                                )}
                                            {(orderDetail?.promotionCode ??
                                                selectedOrder.promotionCode) && (
                                                    <div className="flex justify-between text-gray-600">
                                                        <span>Mã khuyến mãi:</span>
                                                        <span className="font-semibold">
                                                            {orderDetail?.promotionCode ??
                                                                selectedOrder.promotionCode}
                                                        </span>
                                                    </div>
                                                )}
                                            {(orderDetail?.pointUsed ?? selectedOrder.pointUsed) !==
                                                undefined &&
                                                (orderDetail?.pointUsed ?? selectedOrder.pointUsed) !==
                                                null && (
                                                    <div className="flex justify-between text-gray-600">
                                                        <span>Điểm đã dùng:</span>
                                                        <span className="font-semibold">
                                                            {(orderDetail?.pointUsed ??
                                                                selectedOrder.pointUsed) === 0
                                                                ? "0 điểm"
                                                                : `-${(
                                                                    orderDetail?.pointUsed ??
                                                                    selectedOrder.pointUsed ??
                                                                    0
                                                                ).toLocaleString("vi-VN")} điểm`}
                                                        </span>
                                                    </div>
                                                )}
                                            {(orderDetail?.pointEarned ??
                                                selectedOrder.pointEarned) !== undefined &&
                                                (orderDetail?.pointEarned ??
                                                    selectedOrder.pointEarned) !== null && (
                                                    <div className="flex justify-between text-green-600">
                                                        <span>Điểm nhận được:</span>
                                                        <span className="font-semibold">
                                                            {(orderDetail?.pointEarned ??
                                                                selectedOrder.pointEarned) === 0
                                                                ? "0 điểm"
                                                                : `+${(
                                                                    orderDetail?.pointEarned ??
                                                                    selectedOrder.pointEarned ??
                                                                    0
                                                                ).toLocaleString("vi-VN")} điểm`}
                                                        </span>
                                                    </div>
                                                )}
                                            <div className="flex justify-between pt-2 mt-2 border-t-2 border-gray-200">
                                                <span className="font-bold text-base">
                                                    Tổng thanh toán:
                                                </span>
                                                <span className="font-bold text-xl text-[#EC6426]">
                                                    {formatCurrency(
                                                        orderDetail?.amount ?? selectedOrder.amount
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-4 border border-gray-100 rounded-xl">
                                        <h3 className="font-semibold text-gray-800 mb-3">
                                            Danh sách món
                                        </h3>
                                        {orderDetail?.orderItems &&
                                            orderDetail.orderItems.length > 0 ? (
                                            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                                                {orderDetail.orderItems.map((item, index) => {
                                                    const isCombo =
                                                        item.comboDTO !== null &&
                                                        item.comboDTO !== undefined;
                                                    const displayName =
                                                        isCombo && item.comboDTO
                                                            ? item.comboDTO.name
                                                            : item.productName || "Sản phẩm";
                                                    const displayDescription =
                                                        isCombo && item.comboDTO
                                                            ? item.comboDTO.description
                                                            : null;
                                                    const displayPrice =
                                                        isCombo && item.comboDTO
                                                            ? item.comboDTO.price
                                                            : (item.price ?? 0);

                                                    return (
                                                        <div
                                                            key={`${isCombo ? "combo" : "product"
                                                                }-${item.productId}-${index}`}
                                                            className="flex items-start justify-between gap-3 border-b border-dashed border-gray-200 pb-3"
                                                        >
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-semibold text-sm text-gray-900">
                                                                        {displayName}
                                                                    </p>
                                                                    {isCombo && (
                                                                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                                                                            COMBO
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {displayDescription && (
                                                                    <p className="text-xs text-gray-600 mt-1">
                                                                        {displayDescription}
                                                                    </p>
                                                                )}
                                                                {item.note && (
                                                                    <p className="text-xs text-gray-500 mt-1 bg-gray-100 rounded-lg px-3 py-1 whitespace-pre-line">
                                                                        {item.note}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="text-right text-sm">
                                                                <p className="font-semibold text-[#EC6426]">
                                                                    {formatCurrency(displayPrice)}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    x {item.quantity}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                {detailLoading
                                                    ? "Đang tải thông tin món ăn..."
                                                    : "Không có dữ liệu món ăn cho đơn này."}
                                            </p>
                                        )}
                                    </Card>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

export default BranchOrdersPage;
