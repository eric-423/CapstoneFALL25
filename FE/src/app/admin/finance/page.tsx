'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MOCK_DASHBOARD_STATS } from '@/utils/mocks/data/dashboard.mock';
import { DollarSign, FileText, TrendingUp, TrendingDown, Building2, BarChart3 } from 'lucide-react';

export default function FinancePage() {
    const stats = MOCK_DASHBOARD_STATS;

    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#f9fafb] py-8">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight flex items-center gap-3">
                                <DollarSign className="text-primary" size={36} />
                                Quản Lý Tài Chính
                            </h1>
                            <p className="text-gray-600 text-lg">Báo cáo tài chính và doanh thu</p>
                        </div>
                        <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 rounded-xl font-semibold hover:scale-105">
                            <FileText size={22} className="mr-2" strokeWidth={2.5} />
                            Xuất Báo Cáo
                        </Button>
                    </div>

                    {/* Financial Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="relative overflow-hidden p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Doanh Thu Tháng</h3>
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                        <TrendingUp className="text-white" size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p className="text-4xl font-bold text-green-600 mb-3 group-hover:scale-105 transition-transform">
                                    {(stats.revenue.monthly / 1000000).toFixed(1)}M đ
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                        +{stats.revenue.growth.monthly}%
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">so với tháng trước</span>
                                </div>
                            </div>
                        </Card>
                        <Card className="relative overflow-hidden p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Chi Phí Tháng</h3>
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                        <TrendingDown className="text-white" size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p className="text-4xl font-bold text-red-600 mb-3 group-hover:scale-105 transition-transform">120M đ</p>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                        +5%
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">so với tháng trước</span>
                                </div>
                            </div>
                        </Card>
                        <Card className="relative overflow-hidden p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Lợi Nhuận Tháng</h3>
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                        <DollarSign className="text-white" size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform">
                                    260M đ
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                                        +12%
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">so với tháng trước</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Revenue by Branch */}
                    <Card className="p-8 mb-8 border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Building2 className="text-white" size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Doanh Thu Theo Chi Nhánh</h2>
                        </div>
                        <div className="space-y-4">
                            {stats.topBranches.map((branch, index) => (
                                <div key={branch.id} className="flex items-center gap-5 p-5 bg-gradient-to-r from-gray-50 to-transparent rounded-2xl hover:from-primary/5 hover:shadow-md transition-all duration-300 border border-gray-100 group">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#8B6F47] to-[#6d5738] rounded-2xl flex items-center justify-center text-white font-bold shadow-lg text-lg group-hover:scale-110 transition-transform">
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors">{branch.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                                                {branch.orders} đơn
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                            {(branch.revenue / 1000000).toFixed(1)}M
                                        </p>
                                        <p className="text-xs text-gray-500 font-semibold mt-1">VNĐ</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Revenue Chart */}
                    <Card className="p-8 border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <BarChart3 className="text-white" size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Doanh Thu 5 Ngày Gần Nhất</h2>
                        </div>
                        <div className="space-y-5">
                            {stats.revenueChart.map(item => {
                                const maxRevenue = Math.max(...stats.revenueChart.map(i => i.revenue));
                                const percentage = (item.revenue / maxRevenue) * 100;

                                return (
                                    <div key={item.date} className="flex items-center gap-5 group">
                                        <span className="text-sm font-bold w-32 text-gray-700 group-hover:text-primary transition-colors">
                                            {new Date(item.date).toLocaleDateString('vi-VN')}
                                        </span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-12 relative overflow-hidden shadow-inner">
                                            <div
                                                className="bg-gradient-to-r from-primary via-secondary to-primary h-12 rounded-full flex items-center justify-end pr-5 text-white text-base font-bold transition-all duration-700 shadow-lg group-hover:shadow-2xl"
                                                style={{ width: `${percentage}%` }}
                                            >
                                                {(item.revenue / 1000000).toFixed(1)}M
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </AdminGuard>
    );
}
