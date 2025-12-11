"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { findCustomerByPhoneApi, dinningTablePayment } from "@/apis/payment.api";
import {
    X,
    CreditCard,
    Phone,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { TableData } from "@/apis/table.api";
import { assignCustomerToOrder } from "@/apis/order.api";

interface PaymentMethod {
    id: number;
    name: string;
}

interface CustomerInfo {
    id: number;
    fullName?: string;
    name?: string;
    email?: string;
    phone?: string;
    memberPoint?: number;
}

interface DiningTablePaymentModalProps {
    isOpen: boolean;
    table: TableData | null;
    onClose: () => void;
    onPaymentSuccess: () => void;
    onNotification: (message: string, type: "success" | "error") => void;
}

export function DiningTablePaymentModal({
    isOpen,
    table,
    onClose,
    onPaymentSuccess,
    onNotification,
}: DiningTablePaymentModalProps) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [customerPhone, setCustomerPhone] = useState("");
    const [isVerifyingCustomer, setIsVerifyingCustomer] = useState(false);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [customerVerificationError, setCustomerVerificationError] = useState<string | null>(null);
    const [showPhoneInput, setShowPhoneInput] = useState(false);
    const [promotionCode, setPromotionCode] = useState("");
    const [discountValue, setDiscountValue] = useState<number>(0);
    const [usedPoints, setUsedPoints] = useState<number>(0);
    const hasFetchedPaymentMethods = useRef(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    useEffect(() => {
        if (isOpen && table && !hasFetchedPaymentMethods.current) {
            // Fetch payment methods only once when modal opens
            hasFetchedPaymentMethods.current = true;

            const fetchPaymentMethods = async () => {
                try {
                    const response = await fetch("/api/payment-method");
                    if (!response.ok) {
                        throw new Error("Failed to fetch payment methods");
                    }
                    const result = await response.json();
                    setPaymentMethods(result.data || []);
                } catch (error) {
                    console.error("Error fetching payment methods:", error);
                    onNotification("Không thể tải phương thức thanh toán", "error");
                    hasFetchedPaymentMethods.current = false; // Reset on error to allow retry
                }
            };

            fetchPaymentMethods();
            setCustomerPhone("");
            setCustomerInfo(null);
            setCustomerVerificationError(null);
            setSelectedPaymentMethod(null);
            setShowPhoneInput(false);
            setPromotionCode("");
            setDiscountValue(0);
            setUsedPoints(0);
            setErrorMessage(null);
        } else if (!isOpen) {
            // Reset flag when modal closes
            hasFetchedPaymentMethods.current = false;
            setErrorMessage(null);
        }
    }, [isOpen, table, onNotification]);

    const handleVerifyCustomer = async () => {
        if (!customerPhone.trim()) {
            setCustomerVerificationError("Vui lòng nhập số điện thoại");
            return;
        }

        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!phoneRegex.test(customerPhone.trim())) {
            setCustomerVerificationError("Số điện thoại không hợp lệ");
            return;
        }

        setIsVerifyingCustomer(true);
        setCustomerVerificationError(null);

        try {
            const response = await findCustomerByPhoneApi(customerPhone.trim());
            if (response.data) {
                setCustomerInfo(response.data);
                setCustomerVerificationError(null);

                // Auto-fill usedPoints from memberPoint when customer is found (only if > 0)
                // Nhưng không được vượt quá số điểm tối đa tính từ subTotal
                if (response.data.memberPoint && response.data.memberPoint > 0) {
                    const maxPointsFromSubTotal = table?.currentOrder?.subTotal ? Math.floor(table.currentOrder.subTotal / 1000) : 0;
                    const maxPoints = Math.min(response.data.memberPoint, maxPointsFromSubTotal);
                    setUsedPoints(maxPoints > 0 ? maxPoints : 0);
                } else {
                    setUsedPoints(0);
                }

                if (table?.currentOrder?.id && response.data.id) {
                    await assignCustomerToOrder(response.data.id, table.currentOrder.id);
                }

            } else {
                setCustomerVerificationError("Không có người dùng nào có sdt này");
                setCustomerInfo(null);
                setPromotionCode("");
                setDiscountValue(0);
                setUsedPoints(0);
                setErrorMessage(null);
            }
        } catch (error) {
            console.error("Error verifying customer:", error);
            setCustomerVerificationError("Không có người dùng nào có sdt này");
            setCustomerInfo(null);
            setPromotionCode("");
            setDiscountValue(0);
            setUsedPoints(0);
            setErrorMessage(null);
        } finally {
            setIsVerifyingCustomer(false);
        }
    };

    const handleValidateUsedPoints = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === "") {
            setUsedPoints(0);
            return;
        }
        const parsedValue = parseInt(value) || 0;

        const maxPointsFromSubTotal = table?.currentOrder?.subTotal ? Math.floor(table.currentOrder.subTotal / 1000) : 0;
        const customerAvailablePoints = customerInfo?.memberPoint || 0;
        const maxPoints = Math.min(customerAvailablePoints, maxPointsFromSubTotal);

        if (parsedValue < 0) {
            setUsedPoints(0);
        } else if (parsedValue > maxPoints) {
            setUsedPoints(maxPoints);
        } else {
            setUsedPoints(parsedValue);
        }
    };

    const handlePayment = async () => {
        if (!table?.currentOrder || !selectedPaymentMethod) {
            onNotification("Vui lòng chọn phương thức thanh toán", "error");
            return;
        }

        if (table.currentOrder.paymentUrl) {
            window.location.href = table.currentOrder.paymentUrl;
            return;
        }

        setIsProcessingPayment(true);
        setErrorMessage(null);

        try {
            const response = await dinningTablePayment({
                orderId: table.currentOrder.id,
                paymentMethodId: selectedPaymentMethod,
                promotionCode: promotionCode || "",
                discountValue: discountValue || 0,
                usedPoints: usedPoints || 0,
            });

            if (selectedPaymentMethod === 2 && response.data?.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                onNotification("Thanh toán thành công!", "success");
                onClose();
                onPaymentSuccess();
            }
        } catch (error) {
            console.error("Error processing payment:", error);

            const errorObj = error as Error & { errorData?: { message?: string; error?: string } };
            const errorMessage = errorObj?.errorData?.message || errorObj?.message || "Không thể xử lý thanh toán. Vui lòng thử lại.";

            if (errorMessage.includes('All order items must be delivered before payment') ||
                errorMessage.includes('must be delivered')) {
                setErrorMessage("Tất cả sản phẩm phải được xác nhận trước khi thanh toán");
            } else {
                setErrorMessage(errorMessage);
            }
        } finally {
            setIsProcessingPayment(false);
        }
    };

    if (!isOpen || !table) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 ">

            <Card className="relative p-8 max-w-lg w-full bg-white border border-gray-200 shadow-2xl rounded-3xl overflow-y-auto max-h-[90vh]">
                {/* Close Button */}
                <button
                    aria-label="Đóng"
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                        <CreditCard className="h-8 w-8 text-white" strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                        Thanh toán
                    </h2>


                </div>

                {/* Customer Info Display - Below Header */}
                {customerInfo && (
                    <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl shadow-sm">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Tên khách hàng:</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {customerInfo.fullName || customerInfo.name || "Khách hàng"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Số điện thoại:</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {customerInfo.phone || customerPhone}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Điểm tích lũy:</span>
                                <span className="text-sm font-semibold text-amber-600">
                                    {customerInfo.memberPoint?.toLocaleString('vi-VN') || 0} điểm
                                </span>
                            </div>
                        </div>
                    </div>
                )}


                {/* Optional Customer Verification - Top Left Corner */}
                <div className="absolute top-6 left-6 z-10">
                    {!showPhoneInput && !customerInfo && (
                        <button
                            onClick={() => setShowPhoneInput(true)}
                            className="w-10 h-10 rounded-full bg-primary text-white border-0 shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
                            title="Xác minh khách hàng (Tùy chọn)"
                        >
                            <Phone size={18} />
                        </button>
                    )}

                    {showPhoneInput && !customerInfo && (
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-3 shadow-lg w-72">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-semibold text-gray-700">
                                    Xác minh khách hàng (Tùy chọn)
                                </label>
                            </div>
                            <div className="relative mb-2">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="tel"
                                    placeholder="Số điện thoại"
                                    value={customerPhone}
                                    onChange={(e) => {
                                        setCustomerPhone(e.target.value);
                                        setCustomerVerificationError(null);
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleVerifyCustomer();
                                        }
                                    }}
                                    className="pl-10 h-9 text-sm border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-200 transition-all"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleVerifyCustomer}
                                    disabled={isVerifyingCustomer || !customerPhone.trim()}
                                    size="sm"
                                    className="flex-1 h-8 text-xs bg-primary text-white border-0 rounded-lg shadow-sm hover:shadow-md disabled:opacity-50"
                                >
                                    {isVerifyingCustomer ? (
                                        <>
                                            <LoadingSpinner className="h-3 w-3 mr-1" />
                                            Đang tìm...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={12} className="mr-1" />
                                            Tìm
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowPhoneInput(false);
                                        setCustomerPhone("");
                                        setCustomerVerificationError(null);
                                    }}
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs border border-gray-300 rounded-lg"
                                >
                                    Hủy
                                </Button>
                            </div>
                            {customerVerificationError && (
                                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {customerVerificationError}
                                </p>
                            )}
                        </div>
                    )}

                    {customerInfo && (
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-3 shadow-lg w-72">
                            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-3 w-3 text-white" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="text-xs font-semibold text-gray-900 truncate">
                                            {customerInfo.fullName || customerInfo.name || "Khách hàng"}
                                        </p>
                                        <p className="text-xs text-gray-600">{customerPhone}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setCustomerInfo(null);
                                            setCustomerPhone("");
                                            setShowPhoneInput(false);
                                            setCustomerVerificationError(null);
                                            setPromotionCode("");
                                            setDiscountValue(0);
                                            setUsedPoints(0);
                                            setErrorMessage(null);
                                        }}
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        Đổi
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment Methods Section */}
                <div className="mt-4">
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Chọn phương thức thanh toán
                        </h3>
                        <p className="text-xs text-gray-500">
                            Vui lòng chọn cách thanh toán cho đơn hàng
                        </p>
                    </div>

                    {customerInfo && (
                        <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Khuyến mãi & Giảm giá</h4>

                            <div className="space-y-2">
                                <div>
                                    <label className="text-xs text-gray-600 mb-1 block">Mã khuyến mãi</label>
                                    <Input
                                        type="text"
                                        placeholder="Nhập mã khuyến mãi (tùy chọn)"
                                        value={promotionCode}
                                        onChange={(e) => setPromotionCode(e.target.value)}
                                        className="h-9 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-600 mb-1 block">
                                        Điểm sử dụng
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={usedPoints > 0 ? usedPoints : ""}
                                        onChange={handleValidateUsedPoints}
                                        min="0"
                                        max={(() => {
                                            const maxPointsFromSubTotal = table?.currentOrder?.subTotal ? Math.floor(table.currentOrder.subTotal / 1000) : 0;
                                            const customerAvailablePoints = customerInfo?.memberPoint || 0;
                                            return Math.min(customerAvailablePoints, maxPointsFromSubTotal);
                                        })()}
                                        className="h-9 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 mb-6">
                        {paymentMethods.length > 0 ? (
                            paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedPaymentMethod(method.id)}
                                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedPaymentMethod === method.id
                                        ? "border-primary bg-primary/10 shadow-md"
                                        : "border-gray-200 hover:border-amber-300 bg-white"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === method.id
                                                    ? "border-primary"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                {selectedPaymentMethod === method.id && (
                                                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                                                )}
                                            </div>
                                            <span className="font-semibold text-gray-900">
                                                {method.name === 'PayOS' ? 'Chuyển khoản' : method.name}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                Đang tải ...
                            </div>
                        )}

                    </div>

                    <div className="flex justify-center items-center">
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    </div>

                    <Button
                        onClick={handlePayment}
                        disabled={!selectedPaymentMethod || isProcessingPayment || paymentMethods.length === 0}
                        className="w-full h-12 bg-primary text-primary-foreground border-0 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 font-semibold text-base transition-all duration-200"
                    >
                        {isProcessingPayment ? (
                            <>
                                <LoadingSpinner className="h-4 w-4 mr-2" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <CreditCard size={18} className="mr-2" />
                                Xác nhận thanh toán
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

