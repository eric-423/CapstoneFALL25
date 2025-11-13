'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gift, Edit, Trash2, CheckCircle, XCircle, Percent, Tag, Calendar, Users as UsersIcon } from 'lucide-react';
import { AddPromotionDialog } from './components/AddPromotionDialog';
import { useEffect, useState } from 'react';
import { getAllPromotions, type Promotion } from '@/apis/promotion.api';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '../components/AdminPageLayout';

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                setIsLoading(true);
                const data = await getAllPromotions();
                setPromotions(data);
            } catch (error) {
                console.error('Error fetching promotions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPromotions();
    }, []);

    const activePromotions = promotions.filter(p => p.status);
    const totalUsage = promotions.reduce((sum, p) => sum + p.usageCount, 0);

    return (
        <AdminGuard>
            <AdminPageLayout>
                {/* Header */}
                <AdminPageHeader
                    title="Quản Lý Khuyến Mãi"
                    description="Tạo và quản lý mã giảm giá"
                    icon={Gift}
                    actions={<AddPromotionDialog />}
                />

                {/* Stats */}
                <AdminStatsGrid>
                    <AdminStatsCard
                        title="Tổng KM"
                        value={promotions.length}
                        icon={Gift}
                    />
                    <AdminStatsCard
                        title="Hoạt động"
                        value={activePromotions.length}
                        icon={CheckCircle}
                        className="border-green-200"
                        iconClassName="from-green-400 to-green-600"
                    />
                    <AdminStatsCard
                        title="Kết thúc"
                        value={promotions.length - activePromotions.length}
                        icon={XCircle}
                        className="border-gray-200"
                        iconClassName="from-gray-400 to-gray-600"
                    />
                    <AdminStatsCard
                        title="Tổng lượt dùng"
                        value={totalUsage}
                        icon={Gift}
                        className="border-[#F8A91F]/20"
                        iconClassName="from-[#EC6426] to-[#F8A91F]"
                    />
                </AdminStatsGrid>

                {/* Promotions Grid */}
                {isLoading ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Đang tải...</p>
                    </div>
                ) : promotions.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Chưa có khuyến mãi nào</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {promotions.map((promo, index) => {
                                // Assign vivid accent colors based on promotion type
                                const accentColors = [
                                    { bg: 'from-red-500 to-pink-500', badge: 'bg-red-100 text-red-700 border-red-200', progress: 'from-red-400 to-pink-500' },
                                    { bg: 'from-yellow-500 to-orange-500', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', progress: 'from-yellow-400 to-orange-500' },
                                    { bg: 'from-blue-500 to-cyan-500', badge: 'bg-blue-100 text-blue-700 border-blue-200', progress: 'from-blue-400 to-cyan-500' },
                                    { bg: 'from-purple-500 to-indigo-500', badge: 'bg-purple-100 text-purple-700 border-purple-200', progress: 'from-purple-400 to-indigo-500' },
                                ];
                                const colors = accentColors[index % accentColors.length];
                                // Backend doesn't return usageLimit, so we can't calculate exact percentage
                                // Using usageCount as indicator
                                const percentage = Math.min((promo.usageCount / 100) * 100, 100); // Assume max 100 for display

                                return (
                                    <Card key={promo.id} className="relative overflow-hidden p-4 bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl group">
                                        {/* Gradient overlay */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.bg}`}></div>

                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-8 h-8 bg-gradient-to-br ${colors.bg} rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-all`}>
                                                        <Gift size={16} className="text-white" strokeWidth={2.5} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#EC6426] transition-colors truncate">{promo.name}</h3>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <Tag size={10} className="text-gray-500" strokeWidth={2.5} />
                                                            <span className="text-xs font-mono font-bold text-white bg-gradient-to-r from-[#EC6426] to-[#F8A91F] px-2 py-0.5 rounded-md shadow-sm">
                                                                {promo.id.substring(0, 8)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-bold border ${promo.status ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-300'
                                                }`}>
                                                {promo.status ? <CheckCircle size={10} strokeWidth={2.5} /> : <XCircle size={10} strokeWidth={2.5} />}
                                                {promo.status ? 'ON' : 'OFF'}
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-3 p-3 bg-gradient-to-br from-gray-50 to-transparent rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 bg-gradient-to-br ${colors.bg} rounded-md flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                                    <Percent size={12} className="text-white" strokeWidth={2.5} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Giảm</p>
                                                    <p className="text-lg font-bold bg-gradient-to-r from-[#EC6426] to-[#F8A91F] bg-clip-text text-transparent truncate">
                                                        {promo.promotionTypeName.includes('%')
                                                            ? `${promo.value}%`
                                                            : `${promo.value.toLocaleString()}đ`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 bg-gradient-to-br ${colors.bg} rounded-md flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                                    <Tag size={12} className="text-white" strokeWidth={2.5} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Tối thiểu</p>
                                                    <p className="text-sm font-bold text-gray-900 truncate">
                                                        {promo.minimumOrderValue.toLocaleString()}đ
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 bg-gradient-to-br ${colors.bg} rounded-md flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                                    <Calendar size={12} className="text-white" strokeWidth={2.5} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Thời gian</p>
                                                    <p className="text-xs font-bold text-gray-900 truncate">
                                                        {new Date(promo.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - {new Date(promo.endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className={`w-6 h-6 bg-gradient-to-br ${colors.bg} rounded-md flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                                    <UsersIcon size={12} className="text-white" strokeWidth={2.5} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Đã sử dụng</p>
                                                        <span className="text-xs font-bold text-gray-900">
                                                            {promo.usageCount} lượt
                                                        </span>
                                                    </div>
                                                    <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                        <div
                                                            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colors.progress} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-0.5 font-medium">
                                                        {promo.usageCount > 0 ? 'Đang sử dụng' : 'Chưa sử dụng'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border border-[#EC6426] text-[#EC6426] hover:bg-[#EC6426] hover:text-white font-semibold rounded-lg transition-all duration-300 py-2 text-xs"
                                            >
                                                <Edit size={12} className="mr-1" strokeWidth={2.5} />
                                                Sửa
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-lg transition-all duration-300 py-2 text-xs"
                                            >
                                                <Trash2 size={12} className="mr-1" strokeWidth={2.5} />
                                                Xóa
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                    </div>
                )}
            </AdminPageLayout>
        </AdminGuard>
    );
}
