'use client';

import { useState } from 'react';
import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// import { MOCK_DASHBOARD_STATS } from '@/utils/mocks/data/dashboard.mock';
import { DollarSign, FileText, TrendingUp, TrendingDown, Building2, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TimePeriodSelector } from './components/TimePeriodSelector';
import { ExpenseBreakdownChart } from './components/ExpenseBreakdownChart';
import { generateRevenueData, expenseBreakdownData } from './mockData';

// Temporary empty stats until API is implemented
const MOCK_DASHBOARD_STATS = {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenue: {
        monthly: 0,
        growth: { monthly: 0 }
    },
    topBranches: [] as any[],
    revenueChart: [] as any[]
};

export default function FinancePage() {
    const stats = MOCK_DASHBOARD_STATS;
    const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');
    const revenueData = generateRevenueData(selectedPeriod);

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

                    {/* Revenue Line Chart with Time Period Selector */}
                    <div className="mb-8">
                        <Card className="p-8 border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
                            {/* Header with Time Period Selector */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#EC6426] to-[#F8A91F] rounded-xl flex items-center justify-center shadow-lg">
                                        <TrendingUp className="text-white" size={24} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Xu hướng doanh thu - {
                                            selectedPeriod === 'day' ? '7 ngày qua' :
                                                selectedPeriod === 'week' ? '4 tuần qua' :
                                                    selectedPeriod === 'month' ? '12 tháng qua' :
                                                        '5 năm qua'
                                        }
                                    </h2>
                                </div>
                                <TimePeriodSelector
                                    selectedPeriod={selectedPeriod}
                                    onPeriodChange={setSelectedPeriod}
                                />
                            </div>

                            {/* Chart */}
                            <div className="w-full h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={revenueData.map(item => ({
                                            date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                                            'Doanh thu': item.revenue / 1000000,
                                            'Lợi nhuận': item.profit ? item.profit / 1000000 : 0,
                                            'Chi phí': item.expenses ? item.expenses / 1000000 : 0,
                                        }))}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#EC6426" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#EC6426" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#6b7280"
                                            style={{ fontSize: '12px', fontWeight: '600' }}
                                        />
                                        <YAxis
                                            stroke="#6b7280"
                                            style={{ fontSize: '12px', fontWeight: '600' }}
                                            tickFormatter={(value: number) => `${value}M`}
                                        />
                                        <Tooltip content={({ active, payload }: { active?: boolean; payload?: Array<{ name?: string; value?: number; color?: string; payload?: unknown }> | null }) => {
                                            if (active && payload && payload.length) {
                                                type ChartPayloadEntry = { name?: string; value?: number; color?: string; payload?: { date?: string } | unknown };
                                                const first = payload[0] as ChartPayloadEntry;
                                                const date = first.payload && typeof (first.payload as { date?: string }).date === 'string' ? (first.payload as { date?: string }).date : '';
                                                return (
                                                    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-2xl">
                                                        <p className="font-bold text-gray-900 mb-2 text-sm">{date}</p>
                                                        {payload.map((entry, index) => {
                                                            const e = entry as ChartPayloadEntry;
                                                            return (
                                                                <p key={index} className="text-sm font-semibold mb-1" style={{ color: e.color }}>
                                                                    {e.name}: {(e.value ?? 0).toFixed(1)}M đ
                                                                </p>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Legend
                                            wrapperStyle={{ fontSize: '14px', fontWeight: '600' }}
                                            iconType="circle"
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="Doanh thu"
                                            stroke="#EC6426"
                                            strokeWidth={3}
                                            fill="url(#revenueGradient)"
                                            animationDuration={1000}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="Lợi nhuận"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            fill="url(#profitGradient)"
                                            animationDuration={1000}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="Chi phí"
                                            stroke="#ef4444"
                                            strokeWidth={3}
                                            fill="url(#expensesGradient)"
                                            animationDuration={1000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 font-semibold mb-1">Cao nhất</p>
                                    <p className="text-lg font-bold text-[#EC6426]">
                                        {Math.max(...revenueData.map(d => d.revenue / 1000000)).toFixed(1)}M
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 font-semibold mb-1">Thấp nhất</p>
                                    <p className="text-lg font-bold text-gray-600">
                                        {Math.min(...revenueData.map(d => d.revenue / 1000000)).toFixed(1)}M
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 font-semibold mb-1">Trung bình</p>
                                    <p className="text-lg font-bold text-gray-700">
                                        {(revenueData.reduce((sum, d) => sum + d.revenue, 0) / revenueData.length / 1000000).toFixed(1)}M
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 font-semibold mb-1">Tổng</p>
                                    <p className="text-lg font-bold bg-gradient-to-r from-[#EC6426] to-[#F8A91F] bg-clip-text text-transparent">
                                        {(revenueData.reduce((sum, d) => sum + d.revenue, 0) / 1000000).toFixed(1)}M
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Revenue by Branch */}
                        <Card className="p-8 border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
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

                        {/* Expense Breakdown */}
                        <ExpenseBreakdownChart data={expenseBreakdownData} />
                    </div>

                    {/* Bar Chart - Daily Revenue */}
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
