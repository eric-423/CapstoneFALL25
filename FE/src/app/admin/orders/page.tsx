'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MOCK_ORDERS } from '@/utils/mocks/data/orders.mock';
import { ShoppingBag, FileText, Eye, CheckCircle, Clock, XCircle, CreditCard, Banknote } from 'lucide-react';

export default function OrdersPage() {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#f9fafb] py-8">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight flex items-center gap-3">
                                <ShoppingBag className="text-primary" size={36} />
                                Quản Lý Đơn Hàng
                            </h1>
                            <p className="text-gray-600 text-lg">Theo dõi và xử lý đơn hàng</p>
                        </div>
                        <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 rounded-xl font-semibold hover:scale-105">
                            <FileText size={22} className="mr-2" strokeWidth={2.5} />
                            Xuất Báo Cáo
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="relative overflow-hidden p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Tổng đơn hàng</p>
                                <p className="text-4xl font-bold text-gray-900 group-hover:text-primary transition-colors">{MOCK_ORDERS.length}</p>
                            </div>
                        </Card>
                        <Card className="relative overflow-hidden p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Đang giao</p>
                                <p className="text-4xl font-bold text-yellow-600">
                                    {MOCK_ORDERS.filter(o => o.status === 'DELIVERING').length}
                                </p>
                            </div>
                        </Card>
                        <Card className="relative overflow-hidden p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Hoàn thành</p>
                                <p className="text-4xl font-bold text-green-600">
                                    {MOCK_ORDERS.filter(o => o.status === 'COMPLETED').length}
                                </p>
                            </div>
                        </Card>
                        <Card className="relative overflow-hidden p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Tổng doanh thu</p>
                                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {(MOCK_ORDERS.reduce((sum, o) => sum + o.amount, 0) / 1000000).toFixed(1)}M
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Orders Table */}
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-[#8B6F47] to-[#6d5738] text-white">
                                    <tr>
                                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Mã ĐH</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Ngày Đặt</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Tổng Tiền</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Thanh Toán</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Trạng Thái</th>
                                        <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {MOCK_ORDERS.map(order => (
                                        <tr key={order.id} className="hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 group">
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div>
                                                    <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">#{order.id}</span>
                                                    {order.customerName && (
                                                        <p className="text-xs text-gray-500 mt-1">{order.customerName}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                    {order.isPickUp ? (
                                                        <p className="text-xs text-blue-600 font-semibold mt-1">Lấy tại quán</p>
                                                    ) : (
                                                        <p className="text-xs text-green-600 font-semibold mt-1">Giao hàng</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div>
                                                    <span className="text-sm font-bold text-gray-900">
                                                        {order.amount.toLocaleString()}đ
                                                    </span>
                                                    {order.discountValue > 0 && (
                                                        <p className="text-xs text-green-600 mt-1">
                                                            Giảm: {order.discountValue.toLocaleString()}đ
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className="flex items-center gap-2 text-sm font-semibold">
                                                    {order.paymentMethod === 'VNPAY' ? (
                                                        <>
                                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <CreditCard size={16} className="text-blue-600" strokeWidth={2.5} />
                                                            </div>
                                                            <span className="text-blue-700">{order.paymentMethod}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                                <Banknote size={16} className="text-green-600" strokeWidth={2.5} />
                                                            </div>
                                                            <span className="text-green-700">{order.paymentMethod}</span>
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border-2 ${order.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                    {order.status === 'COMPLETED' ? <CheckCircle size={14} strokeWidth={2.5} /> :
                                                        order.status === 'PENDING' ? <Clock size={14} strokeWidth={2.5} /> : <XCircle size={14} strokeWidth={2.5} />}
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-xl font-semibold"
                                                >
                                                    <Eye size={16} className="mr-1" strokeWidth={2.5} />
                                                    Chi tiết
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminGuard>
    );
}
