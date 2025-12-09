"use client";

import { useEffect, useState, useMemo } from "react";
import { getTablesByBranch } from "@/apis/branch.api";
import { TableData, OrderItem } from "@/apis/table.api";
import {
  waiterConfirmOrder,
  waiterDeliveredOrder,
  WaiterConfirmRequest,
  WaiterDeliveredRequest,
} from "@/apis/order.api";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DiningTablePaymentModal } from "@/components/common/payment";
import {
  Clock,
  Users,
  ChefHat,
  CheckCircle,
  LayoutGrid,
  RefreshCw,
  TrendingUp,
  QrCode,
  Download,
  Eye,
  X,
  HandPlatter,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/app/admin/components/AdminCard";
import Image from "next/image";

export default function StaffTablesPage() {
  const router = useRouter();
  const [allTables, setAllTables] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTableForQR, setSelectedTableForQR] =
    useState<TableData | null>(null);
  const [selectedTableForAction, setSelectedTableForAction] =
    useState<TableData | null>(null);
  const [processingItemKey, setProcessingItemKey] = useState<string | null>(
    null
  );
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [excludedItemKeys, setExcludedItemKeys] = useState<Set<string>>(
    new Set()
  );
  const [isConfirmingAll, setIsConfirmingAll] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showCustomerVerificationModal, setShowCustomerVerificationModal] = useState(false);
  const [selectedTableForPayment, setSelectedTableForPayment] = useState<TableData | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTables = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Get branchId from cookie
      const branchId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("branchId="))
        ?.split("=")[1];

      if (!branchId) {
        setError("Không tìm thấy thông tin chi nhánh. Vui lòng đăng nhập lại.");
        return;
      }

      const data = await getTablesByBranch(parseInt(branchId));

      // Get ALL tables, not just ones with orders
      setAllTables(data);
    } catch (err) {
      console.error("Error fetching tables:", err);
      setError("Không thể tải danh sách bàn. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const role = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];
    setUserRole(role || null);

    fetchTables();

    const interval = setInterval(() => fetchTables(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTableClick = (tableId: number) => {
    router.push(`/order-table/${tableId}`);
  };

  const generateQRCode = async (table: TableData) => {
    setSelectedTableForQR(table);

    // Generate order URL
    const orderUrl = `${window.location.origin}/order-table/${table.id}`;

    // Use QR Server API to generate QR code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(orderUrl)}`;
    setQrCodeUrl(qrUrl);
  };

  const downloadQRCode = async () => {
    if (!selectedTableForQR || !qrCodeUrl) return;

    try {
      // Fetch the image as blob to avoid cross-origin issues
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `QR-${selectedTableForQR.name.replace(/\s+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      showNotification("Không thể tải QR code. Vui lòng thử lại.", "error");
    }
  };

  const closeQRModal = () => {
    setSelectedTableForQR(null);
    setQrCodeUrl("");
  };

  const openActionModal = (table: TableData) => {
    setSelectedTableForAction(table);
  };

  const closeActionModal = () => {
    setSelectedTableForAction(null);
    setExcludedItemKeys(new Set());
  };

  const toggleExcludeItem = (itemKey: string) => {
    setExcludedItemKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  const handleConfirmAllUnconfirmed = async () => {
    if (!selectedTableForAction?.currentOrder) return;

    const waiterId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1];

    if (!waiterId) {
      showNotification("Không tìm thấy thông tin waiter", "error");
      return;
    }

    // Get all unconfirmed items that are NOT excluded
    const unconfirmedItems = selectedTableForAction.currentOrder.orderItems
      .map((item, index) => ({ item, index }))
      .filter(({ item, index }) => {
        const itemKey = `${item.productId}-${index}`;
        return !item.isConfirmed && !excludedItemKeys.has(itemKey);
      });

    if (unconfirmedItems.length === 0) {
      showNotification("Không có món nào cần xác nhận", "error");
      return;
    }

    setIsConfirmingAll(true);

    try {
      const request: WaiterConfirmRequest = {
        orderId: selectedTableForAction.currentOrder.id,
        waiterId: parseInt(waiterId),
        orderItems: unconfirmedItems.map(({ item }) => ({
          productId: item.productId,
          comboId: item.comboDTO?.id || 0,
          quantity: item.quantity,
          price: item.price,
          note: item.note || "",
        })),
      };

      await waiterConfirmOrder(request);

      showNotification(
        `Đã xác nhận ${unconfirmedItems.length} món thành công`,
        "success"
      );
      setExcludedItemKeys(new Set());
      fetchTables(true);
      closeActionModal();
    } catch (error) {
      console.error("Error confirming items:", error);
      showNotification("Không thể xác nhận món. Vui lòng thử lại.", "error");
    } finally {
      setIsConfirmingAll(false);
    }
  };


  const openCustomerVerificationModal = (table: TableData) => {
    setSelectedTableForPayment(table);
    setShowCustomerVerificationModal(true);
  };

  const closeCustomerVerificationModal = () => {
    setShowCustomerVerificationModal(false);
    setSelectedTableForPayment(null);
  };


  const handleDeliverSingleItem = async (item: OrderItem, index: number) => {
    if (!selectedTableForAction?.currentOrder) return;

    const itemKey = `${item.productId}-${index}`;

    const waiterId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1];

    if (!waiterId) {
      showNotification("Không tìm thấy thông tin waiter", "error");
      return;
    }

    setProcessingItemKey(itemKey);

    try {
      const request: WaiterDeliveredRequest = {
        orderId: selectedTableForAction.currentOrder.id,
        waiterId: parseInt(waiterId),
        orderItems: [
          {
            productId: item.productId,
            comboId: item.comboDTO?.id || 0,
            quantity: item.quantity,
            price: item.price,
            note: item.note || "",
          },
        ],
      };

      await waiterDeliveredOrder(request);

      // Update local state immediately
      setSelectedTableForAction((prev) => {
        if (!prev?.currentOrder) return prev;

        const updatedOrderItems = prev.currentOrder.orderItems.map(
          (orderItem, idx) => {
            if (idx === index) {
              return { ...orderItem, isDelivered: true };
            }
            return orderItem;
          }
        );

        return {
          ...prev,
          currentOrder: {
            ...prev.currentOrder,
            orderItems: updatedOrderItems,
          },
        };
      });

      // Also update allTables state
      setAllTables((prevTables) =>
        prevTables.map((table) => {
          if (table.id === selectedTableForAction.id && table.currentOrder) {
            const updatedOrderItems = table.currentOrder.orderItems.map(
              (orderItem, idx) => {
                if (idx === index) {
                  return { ...orderItem, isDelivered: true };
                }
                return orderItem;
              }
            );

            return {
              ...table,
              currentOrder: {
                ...table.currentOrder,
                orderItems: updatedOrderItems,
              },
            };
          }
          return table;
        })
      );

      showNotification(`Đã giao món thành công`, "success");
    } catch (error) {
      console.error("Error delivering item:", error);
      showNotification(
        "Không thể cập nhật trạng thái. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setProcessingItemKey(null);
    }
  };

  const stats = useMemo(() => {
    const total = allTables.length;
    const occupied = allTables.filter((t) => t.currentOrder !== null).length;
    const available = total - occupied;

    const tablesNeedingConfirmation: string[] = [];
    const tablesNeedingServing: string[] = [];

    allTables.forEach((table) => {
      if (table.currentOrder && table.currentOrder.orderItems.length > 0) {
        const items = table.currentOrder.orderItems;
        const hasUnconfirmedItems = items.some((item) => !item.isConfirmed);
        const allConfirmed = items.every((item) => item.isConfirmed);
        const hasUndeliveredItems = items.some(
          (item) => item.isConfirmed && !item.isDelivered
        );

        if (hasUnconfirmedItems) {
          tablesNeedingConfirmation.push(table.name);
        } else if (allConfirmed && hasUndeliveredItems) {
          tablesNeedingServing.push(table.name);
        }
      }
    });

    const confirmationSubtitle =
      tablesNeedingConfirmation.length > 0
        ? tablesNeedingConfirmation.join(", ")
        : "Không có bàn nào";
    const servingSubtitle =
      tablesNeedingServing.length > 0
        ? tablesNeedingServing.join(", ")
        : "Không có bàn nào";

    return {
      total,
      occupied,
      available,
      needsConfirmation: tablesNeedingConfirmation.length,
      needsServing: tablesNeedingServing.length,
      confirmationSubtitle,
      servingSubtitle,
    };
  }, [allTables]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <LoadingSpinner className="h-12 w-12 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFE6DB]">
        <Card className="p-8 max-w-md mx-4 border-0 shadow-sm rounded-xl">
          <div className="text-center space-y-4">
            <div className="text-red-600 text-5xl">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900">{error}</h2>
            <Button
              onClick={() => fetchTables()}
              className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] text-white border-0 shadow-md hover:shadow-lg"
            >
              Thử lại
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-3">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <Card
            className={`p-4 min-w-[300px] shadow-xl border-2 ${notification.type === "success"
              ? "bg-green-50 border-green-500"
              : "bg-red-50 border-red-500"
              }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <p
                className={`font-semibold ${notification.type === "success"
                  ? "text-green-900"
                  : "text-red-900"
                  }`}
              >
                {notification.message}
              </p>
            </div>
          </Card>
        </div>
      )}

      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header - Compact */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#EC6426] to-[#F8A91F] bg-clip-text text-transparent mb-1">
              Sơ đồ bàn ăn
            </h1>
            <p className="text-gray-600 text-sm">
              Hiển thị {stats.total} bàn - {stats.occupied} đang phục vụ -{" "}
              {stats.available} trống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500">
              {new Date().toLocaleString("vi-VN")}
            </div>
            <Button
              onClick={() => fetchTables(true)}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="border-2 border-gray-300 hover:border-[#EC6426] hover:bg-[#EC6426]/5 transition-all"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#EC6426]" />
            <h2 className="text-base font-semibold text-gray-800">Tổng quan</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <AdminCard
              title="Tổng bàn"
              value={stats.total}
              icon={LayoutGrid}
              subtitle={`${stats.available} bàn trống`}
            />
            <AdminCard
              title="Đang phục vụ"
              value={stats.occupied}
              icon={Users}
              subtitle={`${stats.occupied} bàn có khách`}
            />
            <AdminCard
              title="Bàn cần xác nhận"
              value={stats.needsConfirmation}
              icon={ChefHat}
              subtitle={stats.confirmationSubtitle}
            />
            <AdminCard
              title="Bàn cần phục vụ"
              value={stats.needsServing}
              icon={HandPlatter}
              subtitle={stats.servingSubtitle}
            />
          </div>
        </div>

        {/* Tables Map */}
        <div>
          <div className="flex items-center gap-2 mb-2 mt-4">
            <LayoutGrid className="w-4 h-4 text-[#EC6426]" />
            <h2 className="text-base font-semibold text-gray-800">Sơ đồ bàn</h2>
          </div>
          {allTables.length === 0 ? (
            <Card className="p-12 bg-white border-0 shadow-sm rounded-xl">
              <div className="text-center space-y-4">
                <div className="text-6xl">🍽️</div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Chưa có bàn nào
                </h2>
                <p className="text-gray-600">
                  Danh sách bàn sẽ hiển thị tại đây
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {allTables.map((table) => {
                const hasOrder = table.currentOrder !== null;
                const orderItems = table.currentOrder?.orderItems || [];
                const allConfirmed =
                  orderItems.length > 0 &&
                  orderItems.every((item) => item.isConfirmed);
                const allDelivered =
                  orderItems.length > 0 &&
                  orderItems.every((item) => item.isDelivered);

                return (
                  <Card
                    key={table.id}
                    className={`relative flex flex-col p-4 transition-all duration-300 border-2 rounded-xl ${hasOrder
                      ? "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 hover:border-orange-400 hover:shadow-lg"
                      : "bg-white border-gray-200 hover:border-[#EC6426]/30 hover:shadow-md"
                      }`}
                  >
                    {/* Table Status and QR - Top Right */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateQRCode(table);
                        }}
                        title={`QR - ${table.name}`}
                        className="w-8 h-8 rounded-full bg-white/90 border border-[#EC6426] text-[#EC6426] flex items-center justify-center hover:bg-[#EC6426] hover:text-white transition-colors shadow-sm"
                      >
                        <QrCode size={14} />
                      </button>
                    </div>

                    <div className="flex-grow">
                      {/* Table Info */}
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {table.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Users className="h-3 w-3" />
                          <span>{table.seat} chỗ</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {hasOrder ? (
                        <div className="mb-3">
                          {allDelivered ? (
                            <Badge className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 border-blue-300">
                              <CheckCircle size={10} className="mr-1" />
                              Đã giao
                            </Badge>
                          ) : allConfirmed ? (
                            <Badge className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 border-yellow-300">
                              <ChefHat size={10} className="mr-1" />
                              Đã xác nhận
                            </Badge>
                          ) : (
                            <Badge className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700 border-orange-300">
                              <Clock size={10} className="mr-1" />
                              Đang đặt
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <div className="mb-3">
                          <Badge className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 border-green-300">
                            Trống
                          </Badge>
                        </div>
                      )}

                      {/* Order Summary */}
                      {hasOrder && table.currentOrder && (
                        <div className="mb-3 p-2 bg-white/60 rounded-lg text-xs space-y-1">
                          <div className="text-gray-600">
                            {table.currentOrder.orderItems.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}{" "}
                            món
                          </div>
                          <div className="font-bold text-[#EC6426]">
                            {table.currentOrder.orderItems
                              .reduce((total, item) => {
                                const isCombo = item.comboDTO !== null;
                                const itemPrice = isCombo
                                  ? item.comboDTO?.price || 0
                                  : item.price;
                                return total + itemPrice * item.quantity;
                              }, 0)
                              .toLocaleString()}
                            đ
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 mt-auto">
                      {hasOrder && userRole === "STAFF" && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCustomerVerificationModal(table);
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full text-xs h-9 border-2 border-primary text-primary hover:text-primary/70 hover:shadow-md transition-all duration-200 font-semibold"
                        >
                          <CreditCard size={14} className="mr-1.5" />
                          Thanh toán ngay
                        </Button>
                      )}
                      <div className="flex flex-wrap gap-2">


                        {hasOrder && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              openActionModal(table);
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1 min-w-[60px] text-xs h-8 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-green-500"
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Xử lý
                          </Button>
                        )}
                        <Button
                          onClick={() => handleTableClick(table.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 min-w-[60px] text-xs h-8 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:blue-500"
                        >
                          <Eye size={14} className="mr-1" />
                          Xem
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedTableForQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 backdrop-blur-[1px] p-4">
          <Card className="relative p-6 max-w-md w-full bg-white border-0 shadow-2xl rounded-2xl max-h-full overflow-y-auto">
            {/* Close Button */}
            <button
              aria-label="Đóng"
              onClick={closeQRModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-3 bg-primary rounded-full flex items-center justify-center">
                <QrCode className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold bg-primary bg-clip-text text-transparent mb-1">
                QR Code {selectedTableForQR.name}
              </h2>
              <p className="text-xs text-gray-600">
                Quét mã để đặt món tại bàn
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6 p-4 bg-gray-50 rounded-xl">
              {qrCodeUrl ? (
                <div className="relative">
                  <Image
                    src={qrCodeUrl}
                    alt={`QR Code for ${selectedTableForQR.name}`}
                    width={250}
                    height={250}
                    className="rounded-lg shadow-md"
                  />
                  <div className="absolute inset-0 border-4 border-white/50 rounded-lg pointer-events-none"></div>
                </div>
              ) : (
                <div className="w-[300px] h-[300px] flex items-center justify-center">
                  <LoadingSpinner className="h-12 w-12" />
                </div>
              )}
            </div>

            {/* Table Info */}
            <div className="mb-4 p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Bàn:</span>
                <span className="font-bold text-gray-900">
                  {selectedTableForQR.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Số chỗ:</span>
                <span className="font-semibold text-gray-900">
                  {selectedTableForQR.seat} người
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={downloadQRCode}
                className="flex-1 bg-primary text-primary-foreground border-0 shadow-md hover:shadow-lg"
              >
                <Download size={18} className="mr-2" />
                Tải xuống
              </Button>
              <Button
                onClick={closeQRModal}
                variant="outline"
                className="flex-1 border-2 border-gray-300 hover:bg-gray-100"
              >
                Đóng
              </Button>
            </div>

            {/* URL Info */}
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Link đặt món:</p>
              <p className="text-xs font-mono text-gray-900 break-all">
                {window.location.origin}/order-table/{selectedTableForQR.id}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Waiter Action Modal */}
      {selectedTableForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 backdrop-blur-[1px] p-4">
          <Card className="relative p-6 max-w-2xl w-full bg-white border-0 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              aria-label="Đóng"
              onClick={closeActionModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 bg-primary rounded-full flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold bg-primary bg-clip-text text-transparent mb-1">
                Xử lý order - {selectedTableForAction.name}
              </h2>
              <p className="text-xs text-gray-600">
                Xác nhận hoặc giao món cho từng item
              </p>
            </div>

            {/* Table Info */}
            <div className="mb-4 p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Khách hàng:</span>
                <span className="font-bold text-gray-900">
                  {selectedTableForAction.currentOrder?.customerName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tổng món:</span>
                <span className="font-semibold text-gray-900">
                  {selectedTableForAction.currentOrder?.orderItems.length} món
                </span>
              </div>
            </div>

            {/* Order Items List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto mb-4">
              {selectedTableForAction.currentOrder?.orderItems.map(
                (item, index) => {
                  const isCombo = item.comboDTO !== null;
                  const itemName = isCombo
                    ? item.comboDTO?.name
                    : item.productName;
                  const itemPrice = isCombo
                    ? item.comboDTO?.price || 0
                    : item.price;
                  const itemKey = `${item.productId}-${index}`;
                  const isExcluded = excludedItemKeys.has(itemKey);

                  return (
                    <div
                      key={itemKey}
                      className={`p-4 rounded-lg border-2 transition-all ${isExcluded
                        ? "bg-red-50 border-red-300 opacity-60"
                        : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      {/* Item Details */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-grow">
                          <h4
                            className={`font-semibold mb-1 ${isExcluded ? "text-gray-500 line-through" : "text-gray-900"}`}
                          >
                            {itemName}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                            <span>SL: {item.quantity}</span>
                            <span>•</span>
                            <span>{itemPrice.toLocaleString()}đ/món</span>
                            <span>•</span>
                            <span className="font-bold text-[#EC6426]">
                              {(itemPrice * item.quantity).toLocaleString()}đ
                            </span>
                          </div>
                          {item.note && (
                            <p className="text-xs text-gray-600 italic">
                              💬 {item.note}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status & Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Status badges */}
                        {item.isDelivered ? (
                          <Badge className="text-xs px-3 py-1 bg-blue-100 text-blue-700 border-blue-300">
                            <HandPlatter size={12} className="mr-1" />
                            Đã phục vụ
                          </Badge>
                        ) : item.isCooked ? (
                          <Badge className="text-xs px-3 py-1 bg-green-100 text-green-700 border-green-300">
                            <CheckCircle size={12} className="mr-1" />
                            Đã chuẩn bị món
                          </Badge>
                        ) : item.isConfirmed ? (
                          <Badge className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 border-yellow-300">
                            <ChefHat size={12} className="mr-1" />
                            Đang chế biến
                          </Badge>
                        ) : (
                          <Badge className="text-xs px-3 py-1 bg-orange-100 text-orange-700 border-orange-300">
                            <Clock size={12} className="mr-1" />
                            Chờ xử lý
                          </Badge>
                        )}

                        <div className="flex-grow" />

                        {/* Action Buttons */}
                        {!item.isDelivered && userRole === "WAITER" && (
                          <div className="flex gap-2">
                            {!item.isConfirmed && (
                              <Button
                                onClick={() => toggleExcludeItem(itemKey)}
                                size="sm"
                                variant="outline"
                                className={`border-2 ${isExcluded
                                  ? "border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                                  : "border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                                  }`}
                              >
                                <X size={14} className="mr-1" />
                                {isExcluded ? "Hoàn tác" : "Loại bỏ"}
                              </Button>
                            )}
                            {item.isConfirmed && item.isCooked && (
                              <Button
                                onClick={() =>
                                  handleDeliverSingleItem(item, index)
                                }
                                disabled={processingItemKey === itemKey}
                                size="sm"
                                className="bg-primary text-primary-foreground border-0 hover:shadow-md disabled:opacity-50"
                              >
                                {processingItemKey === itemKey ? (
                                  <LoadingSpinner className="h-3 w-3" />
                                ) : (
                                  <>
                                    <HandPlatter size={14} className="mr-1" />
                                    Đã phục vụ
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            {userRole === "WAITER" &&
              selectedTableForAction.currentOrder?.orderItems.some(
                (item) => !item.isConfirmed
              ) && (
                <div className="border-t-2 border-gray-200 pt-4">
                  <Button
                    onClick={handleConfirmAllUnconfirmed}
                    disabled={isConfirmingAll}
                    className="w-full bg-primary text-primary-foreground border-0 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {isConfirmingAll ? (
                      <>
                        <LoadingSpinner className="h-4 w-4 mr-2" />
                        Đang xác nhận...
                      </>
                    ) : (
                      <>
                        <ChefHat size={18} className="mr-2" />
                        Xác nhận tất cả món chờ xử lý
                        {excludedItemKeys.size > 0 && (
                          <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded">
                            (Bỏ qua {excludedItemKeys.size} món)
                          </span>
                        )}
                      </>
                    )}
                  </Button>
                </div>
              )}

            {userRole === "STAFF" &&
              selectedTableForAction.currentOrder?.orderItems.every(
                (item) => item.isDelivered
              ) && (
                <div className="border-t-2 border-gray-200 pt-4">
                  <Button
                    onClick={() => openCustomerVerificationModal(selectedTableForAction)}
                    className="w-full bg-primary text-primary-foreground border-0 shadow-md hover:shadow-lg"
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Thanh toán
                  </Button>
                </div>
              )}
          </Card>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 duration-300">
          <Card
            className={`p-4 min-w-[300px] shadow-lg border-2 ${notification.type === "success"
              ? "bg-green-50 border-green-500"
              : "bg-red-50 border-red-500"
              }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-grow">
                <p
                  className={`font-semibold ${notification.type === "success"
                    ? "text-green-900"
                    : "text-red-900"
                    }`}
                >
                  {notification.type === "success" ? "Thành công" : "Lỗi"}
                </p>
                <p
                  className={`text-sm ${notification.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                    }`}
                >
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                aria-label="Đóng"
                className="flex-shrink-0 hover:opacity-70"
              >
                <X
                  className={`h-4 w-4 ${notification.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                    }`}
                />
              </button>
            </div>
          </Card>
        </div>
      )}

      {userRole === "STAFF" && (
        <DiningTablePaymentModal
          isOpen={showCustomerVerificationModal}
          table={selectedTableForPayment}
          onClose={closeCustomerVerificationModal}
          onPaymentSuccess={() => {
            fetchTables(true);
          }}
          onNotification={showNotification}
        />
      )}

    </div>
  );
}
