'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MOCK_PROMOTIONS } from '@/utils/mocks/data/promotions.mock';
import { Gift, Plus, Edit, Trash2, CheckCircle, XCircle, Percent, Tag, Calendar, Users as UsersIcon } from 'lucide-react';

export default function PromotionsPage() {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#f9fafb] py-8">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight flex items-center gap-3">
                                <Gift className="text-primary" size={36} />
                                Quản Lý Khuyến Mãi
                            </h1>
                            <p className="text-gray-600 text-lg">Tạo và quản lý mã giảm giá</p>
                        </div>
                        <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 rounded-xl font-semibold hover:scale-105">
                            <Plus size={22} className="mr-2" strokeWidth={2.5} />
                            Tạo Khuyến Mãi
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="relative overflow-hidden p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Tổng khuyến mãi</p>
                                <p className="text-4xl font-bold text-gray-900 group-hover:text-primary transition-colors">{MOCK_PROMOTIONS.length}</p>
                            </div>
                        </Card>
                        <Card className="relative overflow-hidden p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Đang hoạt động</p>
                                <p className="text-4xl font-bold text-green-600">
                                    {MOCK_PROMOTIONS.filter(p => p.status === 'ACTIVE').length}
                                </p>
                            </div>
                        </Card>
                        <Card className="relative overflow-hidden p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Đã kết thúc</p>
                                <p className="text-4xl font-bold text-gray-600">
                                    {MOCK_PROMOTIONS.filter(p => p.status !== 'ACTIVE').length}
                                </p>
                            </div>
                        </Card>
                        <Card className="relative overflow-hidden p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Đã sử dụng</p>
                                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {MOCK_PROMOTIONS.reduce((sum, p) => sum + p.usedCount, 0)}
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Promotions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {MOCK_PROMOTIONS.map((promo, index) => {
                            // Assign vivid accent colors based on promotion type
                            const accentColors = [
                                { bg: 'from-red-500 to-pink-500', badge: 'bg-red-100 text-red-700 border-red-200', progress: 'from-red-400 to-pink-500' },
                                { bg: 'from-yellow-500 to-orange-500', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', progress: 'from-yellow-400 to-orange-500' },
                                { bg: 'from-blue-500 to-cyan-500', badge: 'bg-blue-100 text-blue-700 border-blue-200', progress: 'from-blue-400 to-cyan-500' },
                                { bg: 'from-purple-500 to-indigo-500', badge: 'bg-purple-100 text-purple-700 border-purple-200', progress: 'from-purple-400 to-indigo-500' },
                            ];
                            const colors = accentColors[index % accentColors.length];
                            const percentage = (promo.usedCount / promo.usageLimit) * 100;

                            return (
                                <Card key={promo.id} className="relative overflow-hidden p-8 bg-white border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl group">
                                    {/* Gradient overlay */}
                                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${colors.bg}`}></div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className={`w-14 h-14 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                                                    <Gift size={26} className="text-white" strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{promo.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <Tag size={14} className="text-gray-500" strokeWidth={2.5} />
                                                        <span className="text-sm font-mono font-bold text-white bg-gradient-to-r from-primary to-secondary px-4 py-1.5 rounded-xl shadow-md">
                                                            {promo.code}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-bold border-2 ${promo.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-300'
                                            }`}>
                                            {promo.status === 'ACTIVE' ? <CheckCircle size={14} strokeWidth={2.5} /> : <XCircle size={14} strokeWidth={2.5} />}
                                            {promo.status}
                                        </span>
                                    </div>

                                    <div className="space-y-4 mb-6 p-5 bg-gradient-to-br from-gray-50 to-transparent rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                                                <Percent size={20} className="text-white" strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Giá trị giảm</p>
                                                <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                                    {promo.discountType === 'PERCENTAGE'
                                                        ? `${promo.discountValue}%`
                                                        : `${promo.discountValue.toLocaleString()}đ`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                                                <Calendar size={20} className="text-white" strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Thời gian</p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {new Date(promo.startDate).toLocaleDateString('vi-VN')} - {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                                                <UsersIcon size={20} className="text-white" strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Lượt sử dụng</p>
                                                    <span className="text-sm font-bold text-gray-900">
                                                        {promo.usedCount}/{promo.usageLimit}
                                                    </span>
                                                </div>
                                                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colors.progress} rounded-full transition-all duration-1000 ease-out shadow-md`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1.5 font-medium">
                                                    {percentage.toFixed(0)}% đã sử dụng
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-5 border-t-2 border-gray-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all duration-300 py-5"
                                        >
                                            <Edit size={16} className="mr-1" strokeWidth={2.5} />
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-xl transition-all duration-300 py-5"
                                        >
                                            <Trash2 size={16} className="mr-1" strokeWidth={2.5} />
                                            Xóa
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
