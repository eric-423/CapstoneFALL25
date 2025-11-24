'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { getTablesByBranch } from '@/apis/branch.api';
import { TableData } from '@/apis/table.api';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, CheckCircle, DollarSign, LayoutGrid, RefreshCw, TrendingUp, QrCode, Download, Eye, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AdminCard } from '@/app/admin/components/AdminCard';
import Image from 'next/image';

const getOrderStatusBadge = (order: TableData['currentOrder']) => {
    if (!order) return null;

    const orderItems = order.orderItems || [];
    const allConfirmed = orderItems.length > 0 && orderItems.every(item => item.isConfirmed);
    const allDelivered = orderItems.length > 0 && orderItems.every(item => item.isDelivered);

    if (allDelivered) {
        return <Badge className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border-2 bg-blue-50 text-blue-700 border-blue-200"><CheckCircle size={14} strokeWidth={2.5} />Đã giao món</Badge>;
    }
    if (allConfirmed) {
        return <Badge className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border-2 bg-yellow-50 text-yellow-700 border-yellow-200"><ChefHat size={14} strokeWidth={2.5} />Đã xác nhận</Badge>;
    }
    return <Badge className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border-2 bg-orange-50 text-orange-700 border-orange-200"><Clock size={14} strokeWidth={2.5} />Đã đặt món</Badge>;
};

const getOrderStatusIcon = (order: TableData['currentOrder']) => {
    if (!order) return <Clock className="h-5 w-5 text-gray-400" />;

    const orderItems = order.orderItems || [];
    const allConfirmed = orderItems.length > 0 && orderItems.every(item => item.isConfirmed);
    const allDelivered = orderItems.length > 0 && orderItems.every(item => item.isDelivered);

    if (allDelivered) {
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
    }
    if (allConfirmed) {
        return <ChefHat className="h-5 w-5 text-yellow-600" />;
    }
    return <Clock className="h-5 w-5 text-orange-600" />;
};

export default function StaffTablesPage() {
    const router = useRouter();
    const [allTables, setAllTables] = useState<TableData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTableForQR, setSelectedTableForQR] = useState<TableData | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const qrCanvasRef = useRef<HTMLCanvasElement>(null);

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
                .split('; ')
                .find(row => row.startsWith('branchId='))
                ?.split('=')[1];

            if (!branchId) {
                setError('Không tìm thấy thông tin chi nhánh. Vui lòng đăng nhập lại.');
                return;
            }

            const data = await getTablesByBranch(parseInt(branchId));

            // Get ALL tables, not just ones with orders
            setAllTables(data);
        } catch (err) {
            console.error('Error fetching tables:', err);
            setError('Không thể tải danh sách bàn. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTables();

        // Auto refresh every 30 seconds
        const interval = setInterval(() => fetchTables(true), 30000);
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

    const downloadQRCode = () => {
        if (!selectedTableForQR || !qrCodeUrl) return;

        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `QR-${selectedTableForQR.name.replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const closeQRModal = () => {
        setSelectedTableForQR(null);
        setQrCodeUrl('');
    };

    const stats = useMemo(() => {
        const total = allTables.length;
        const occupied = allTables.filter(t => t.currentOrder !== null).length;
        const available = total - occupied;
        const totalRevenue = allTables.reduce((sum, table) => {
            if (!table.currentOrder) return sum;
            return sum + table.currentOrder.orderItems.reduce((total, item) => {
                const isCombo = item.comboDTO !== null;
                const itemPrice = isCombo ? item.comboDTO?.price || 0 : item.price;
                return total + itemPrice * item.quantity;
            }, 0);
        }, 0);
        const totalItems = allTables.reduce((sum, table) => {
            if (!table.currentOrder) return sum;
            return sum + table.currentOrder.orderItems.reduce((total, item) => total + item.quantity, 0);
        }, 0);
        return { total, occupied, available, totalRevenue, totalItems };
    }, [allTables]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#EFE6DB]">
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
        <div className="min-h-screen bg-[#EFE6DB]">
            <div className="max-w-[1800px] mx-auto space-y-4">
                {/* Header - Compact */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#EC6426] to-[#F8A91F] bg-clip-text text-transparent mb-1">
                            Sơ đồ bàn ăn
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Hiển thị {stats.total} bàn - {stats.occupied} đang phục vụ - {stats.available} trống
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-xs text-gray-500">
                            {new Date().toLocaleString('vi-VN')}
                        </div>
                        <Button
                            onClick={() => fetchTables(true)}
                            disabled={isRefreshing}
                            variant="outline"
                            size="sm"
                            className="border-2 border-gray-300 hover:border-[#EC6426] hover:bg-[#EC6426]/5 transition-all"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* Stats Section */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-[#EC6426]" />
                        <h2 className="text-base font-semibold text-gray-800">
                            Tổng quan
                        </h2>
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
                            title="Tổng món"
                            value={stats.totalItems}
                            icon={ChefHat}
                            subtitle={`${stats.totalItems} món đã đặt`}
                        />
                        <AdminCard
                            title="Doanh thu"
                            value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`}
                            icon={DollarSign}
                            subtitle={`${stats.totalRevenue.toLocaleString()}đ`}
                        />
                    </div>
                </div>

                {/* Tables Map */}
                <div>
                    <div className="flex items-center gap-2 mb-2 mt-4">
                        <LayoutGrid className="w-4 h-4 text-[#EC6426]" />
                        <h2 className="text-base font-semibold text-gray-800">
                            Sơ đồ bàn
                        </h2>
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
                                const allConfirmed = orderItems.length > 0 && orderItems.every(item => item.isConfirmed);
                                const allDelivered = orderItems.length > 0 && orderItems.every(item => item.isDelivered);

                                return (
                                    <Card
                                        key={table.id}
                                        className={`relative flex flex-col p-4 transition-all duration-300 border-2 rounded-xl ${hasOrder
                                            ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 hover:border-orange-400 hover:shadow-lg'
                                            : 'bg-white border-gray-200 hover:border-[#EC6426]/30 hover:shadow-md'
                                            }`}
                                    >
                                        {/* Table Status Indicator */}
                                        <div className="absolute top-2 right-2">
                                            <div className={`w-3 h-3 rounded-full ${hasOrder ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'
                                                }`}></div>
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
                                                    <div className="font-semibold text-gray-900 truncate">
                                                        {table.currentOrder.customerName}
                                                    </div>
                                                    <div className="text-gray-600">
                                                        {table.currentOrder.orderItems.reduce((sum, item) => sum + item.quantity, 0)} món
                                                    </div>
                                                    <div className="font-bold text-[#EC6426]">
                                                        {table.currentOrder.orderItems
                                                            .reduce((total, item) => {
                                                                const isCombo = item.comboDTO !== null;
                                                                const itemPrice = isCombo ? item.comboDTO?.price || 0 : item.price;
                                                                return total + itemPrice * item.quantity;
                                                            }, 0)
                                                            .toLocaleString()}đ
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 mt-auto">
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    generateQRCode(table);
                                                }}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-xs h-8 border-2 border-[#EC6426] text-[#EC6426] hover:bg-[#EC6426] hover:text-white"
                                            >
                                                <QrCode size={14} className="mr-1" />
                                                QR
                                            </Button>
                                            <Button
                                                onClick={() => handleTableClick(table.id)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-xs h-8 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                                            >
                                                <Eye size={14} className="mr-1" />
                                                Xem
                                            </Button>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="relative p-6 max-w-md w-full bg-white border-0 shadow-2xl rounded-2xl max-h-full overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={closeQRModal}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-4">
                            <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-[#EC6426] to-[#F8A91F] rounded-full flex items-center justify-center">
                                <QrCode className="h-7 w-7 text-white" strokeWidth={2.5} />
                            </div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-[#EC6426] to-[#F8A91F] bg-clip-text text-transparent mb-1">
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
                                <span className="font-bold text-gray-900">{selectedTableForQR.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Số chỗ:</span>
                                <span className="font-semibold text-gray-900">{selectedTableForQR.seat} người</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                onClick={downloadQRCode}
                                className="flex-1 bg-gradient-to-r from-[#EC6426] to-[#F8A91F] text-white border-0 shadow-md hover:shadow-lg"
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
        </div>
    );
}
