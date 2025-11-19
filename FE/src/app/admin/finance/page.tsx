'use client';

import { useState } from 'react';
import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DollarSign, FileText, TrendingUp, Calendar, Building2, ShoppingCart, ArrowUpRight, ArrowDownRight, ChevronDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TimePeriodSelector } from './components/TimePeriodSelector';
import { generateRevenueData, branchComparisonData, branches } from './mockData';

// Mock dashboard stats - Only Revenue focused
const MOCK_DASHBOARD_STATS = {
    totalRevenue: 4500000000, // 4.5B tổng doanh thu
    monthlyRevenue: 380000000, // 380M doanh thu tháng này
    dailyAverage: 12666667, // ~12.7M trung bình mỗi ngày
    revenueGrowth: 12.5, // % tăng trưởng so với tháng trước
    todayRevenue: 15500000, // 15.5M hôm nay
    yesterdayRevenue: 14200000, // 14.2M hôm qua
    topBranches: branchComparisonData.map(branch => ({
        id: branch.branch,
        name: branch.branch,
        revenue: branch.revenue,
        orders: branch.orders,
        growth: (Math.random() * 20 - 5).toFixed(1) // Random growth -5% to +15%
    })),
};

export default function FinancePage() {
    const stats = MOCK_DASHBOARD_STATS;
    const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');
    const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
    const [showBranchDropdown, setShowBranchDropdown] = useState(false);
    const revenueData = generateRevenueData(selectedPeriod);
    const todayGrowth = ((stats.todayRevenue - stats.yesterdayRevenue) / stats.yesterdayRevenue * 100).toFixed(1);

    // Toggle branch selection
    const toggleBranch = (branchName: string) => {
        setSelectedBranches(prev =>
            prev.includes(branchName)
                ? prev.filter(b => b !== branchName)
                : [...prev, branchName]
        );
    };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#EFE6DB]">
                <div className="max-w-[1800px] mx-auto space-y-4">
                    {/* Header - Compact */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#EC6426] to-[#F8A91F] bg-clip-text text-transparent mb-1 flex items-center gap-2">
                                <DollarSign className="text-[#EC6426]" size={24} />
                                Báo Cáo Doanh Thu
                            </h1>
                        </div>
                    </div>

                    {/* Revenue Overview Cards - Compact */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {/* Today's Revenue */}
                        <Card className="relative overflow-hidden p-3 bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#EC6426]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hôm nay</h3>
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#EC6426] to-[#F8A91F] rounded-lg flex items-center justify-center shadow-sm">
                                        <Calendar className="text-white" size={14} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-gray-900 mb-1">
                                    {(stats.todayRevenue / 1000000).toFixed(1)}M
                                </p>
                                <div className="flex items-center gap-0.5">
                                    {parseFloat(todayGrowth) >= 0 ? (
                                        <>
                                            <ArrowUpRight className="text-green-600" size={12} />
                                            <span className="text-xs font-bold text-green-600">+{todayGrowth}%</span>
                                        </>
                                    ) : (
                                        <>
                                            <ArrowDownRight className="text-red-600" size={12} />
                                            <span className="text-xs font-bold text-red-600">{todayGrowth}%</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Monthly Revenue */}
                        <Card className="relative overflow-hidden p-3 bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tháng này</h3>
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                        <TrendingUp className="text-white" size={14} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-gray-900 mb-1">
                                    {(stats.monthlyRevenue / 1000000).toFixed(1)}M
                                </p>
                                <div className="flex items-center gap-0.5">
                                    <ArrowUpRight className="text-green-600" size={12} />
                                    <span className="text-xs font-bold text-green-600">+{stats.revenueGrowth}%</span>
                                </div>
                            </div>
                        </Card>

                        {/* Average Daily */}
                        <Card className="relative overflow-hidden p-3 bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">TB/ngày</h3>
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                                        <ShoppingCart className="text-white" size={14} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-gray-900 mb-1">
                                    {(stats.dailyAverage / 1000000).toFixed(1)}M
                                </p>
                                <p className="text-xs text-gray-500">Tháng này</p>
                            </div>
                        </Card>

                        {/* Total Revenue */}
                        <Card className="relative overflow-hidden p-3 bg-gradient-to-br from-[#EC6426] to-[#F8A91F] border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group">
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-semibold text-white/90 uppercase tracking-wide">Tổng DT</h3>
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shadow-sm backdrop-blur-sm">
                                        <DollarSign className="text-white" size={14} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-white mb-1">
                                    {(stats.totalRevenue / 1000000000).toFixed(2)}B
                                </p>
                                <p className="text-xs text-white/80">Toàn bộ</p>
                            </div>
                        </Card>
                    </div>

                    {/* Revenue Trend Chart - Compact */}
                    <div>
                        <Card className="p-4 border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#EC6426] to-[#F8A91F] rounded-lg flex items-center justify-center shadow-md">
                                        <TrendingUp className="text-white" size={16} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-gray-900">Xu hướng doanh thu</h2>
                                        <p className="text-xs text-gray-500">
                                            {selectedPeriod === 'day' ? '7 ngày qua' :
                                                selectedPeriod === 'week' ? '4 tuần qua' :
                                                    selectedPeriod === 'month' ? '12 tháng qua' : '5 năm qua'}
                                        </p>
                                    </div>
                                </div>
                                <TimePeriodSelector
                                    selectedPeriod={selectedPeriod}
                                    onPeriodChange={setSelectedPeriod}
                                />
                            </div>

                            {/* Branch Selection */}
                            <div className="mb-4 pb-4 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <p className="text-xs font-semibold text-gray-700">
                                            Hiển thị chi nhánh:
                                        </p>
                                        {/* Dropdown for branch selection */}
                                        <div className="relative w-48">
                                            <button
                                                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                                                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 transition-colors border border-gray-200"
                                            >
                                                <span>
                                                    {selectedBranches.length === 0
                                                        ? 'Chọn chi nhánh...'
                                                        : `${selectedBranches.length} chi nhánh`}
                                                </span>
                                                <ChevronDown
                                                    className={`transition-transform ${showBranchDropdown ? 'rotate-180' : ''}`}
                                                    size={14}
                                                />
                                            </button>

                                            {showBranchDropdown && (
                                                <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[200px] overflow-y-auto">
                                                    {branches.map((branch) => {
                                                        const isSelected = selectedBranches.includes(branch.name);
                                                        return (
                                                            <button
                                                                key={branch.id}
                                                                onClick={() => toggleBranch(branch.name)}
                                                                className={`w-full px-2 py-1.5 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${isSelected ? 'bg-[#EC6426]/5' : ''
                                                                    }`}
                                                            >
                                                                <div
                                                                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${isSelected
                                                                        ? 'border-[#EC6426] bg-[#EC6426]'
                                                                        : 'border-gray-300'
                                                                        }`}
                                                                >
                                                                    {isSelected && (
                                                                        <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <div
                                                                    className="w-2 h-2 rounded-full"
                                                                    style={{ backgroundColor: branch.color }}
                                                                />
                                                                <span className={`text-xs font-medium ${isSelected ? 'text-[#EC6426]' : 'text-gray-700'}`}>
                                                                    {branch.name}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {selectedBranches.length > 0 && (
                                        <button
                                            onClick={() => setSelectedBranches([])}
                                            className="text-xs text-red-600 hover:text-red-700 font-semibold"
                                        >
                                            Xóa tất cả
                                        </button>
                                    )}
                                </div>

                                {/* Selected branches display */}
                                {selectedBranches.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {selectedBranches.map((branchName) => {
                                            const branch = branches.find(b => b.name === branchName);
                                            return branch ? (
                                                <div
                                                    key={branch.id}
                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                                                    style={{ backgroundColor: branch.color }}
                                                >
                                                    {branch.name}
                                                    <button
                                                        onClick={() => toggleBranch(branchName)}
                                                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                                    >
                                                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="w-full h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={revenueData.map(item => {
                                            const dataPoint: any = {
                                                date: new Date(item.date).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    ...(selectedPeriod === 'year' ? { year: '2-digit' } : {})
                                                }),
                                                'Tổng doanh thu': item.revenue / 1000000,
                                            };

                                            // Add selected branches to data
                                            selectedBranches.forEach(branchName => {
                                                dataPoint[branchName] = item[branchName as keyof typeof item]
                                                    ? (item[branchName as keyof typeof item] as number) / 1000000
                                                    : 0;
                                            });

                                            return dataPoint;
                                        })}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="totalRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#EC6426" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#EC6426" stopOpacity={0} />
                                            </linearGradient>
                                            {branches.map((branch) => (
                                                <linearGradient key={branch.id} id={`${branch.id}Gradient`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={branch.color} stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor={branch.color} stopOpacity={0} />
                                                </linearGradient>
                                            ))}
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
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-2xl">
                                                            <p className="font-bold text-gray-900 mb-2 text-sm">
                                                                {payload[0].payload.date}
                                                            </p>
                                                            {payload.map((entry, index) => (
                                                                <p key={index} className="text-sm font-semibold mb-1" style={{ color: entry.color }}>
                                                                    {entry.name}: {(entry.value as number).toFixed(1)}M đ
                                                                </p>
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '14px', fontWeight: '600' }} iconType="circle" />

                                        {/* Total Revenue Line */}
                                        <Area
                                            type="monotone"
                                            dataKey="Tổng doanh thu"
                                            stroke="#EC6426"
                                            strokeWidth={3}
                                            fill="url(#totalRevenueGradient)"
                                            animationDuration={1000}
                                        />

                                        {/* Branch Lines */}
                                        {selectedBranches.map((branchName) => {
                                            const branch = branches.find(b => b.name === branchName);
                                            return branch ? (
                                                <Area
                                                    key={branch.id}
                                                    type="monotone"
                                                    dataKey={branchName}
                                                    stroke={branch.color}
                                                    strokeWidth={2.5}
                                                    fill={`url(#${branch.id}Gradient)`}
                                                    animationDuration={1000}
                                                />
                                            ) : null;
                                        })}
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 font-semibold mb-0.5">Cao nhất</p>
                                    <p className="text-base font-bold text-[#EC6426]">
                                        {Math.max(...revenueData.map(d => d.revenue / 1000000)).toFixed(1)}M
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 font-semibold mb-0.5">Thấp nhất</p>
                                    <p className="text-base font-bold text-gray-600">
                                        {Math.min(...revenueData.map(d => d.revenue / 1000000)).toFixed(1)}M
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 font-semibold mb-0.5">Trung bình</p>
                                    <p className="text-base font-bold text-gray-700">
                                        {(revenueData.reduce((sum, d) => sum + d.revenue, 0) / revenueData.length / 1000000).toFixed(1)}M
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 font-semibold mb-0.5">Tổng</p>
                                    <p className="text-base font-bold bg-gradient-to-r from-[#EC6426] to-[#F8A91F] bg-clip-text text-transparent">
                                        {(revenueData.reduce((sum, d) => sum + d.revenue, 0) / 1000000).toFixed(1)}M
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Revenue by Branch - Compact */}
                    <Card className="p-4 border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                                <Building2 className="text-white" size={16} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900">Top chi nhánh tháng</h2>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {stats.topBranches.map((branch, index) => (
                                <div
                                    key={branch.id}
                                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-lg hover:from-[#EC6426]/5 hover:shadow-sm transition-all duration-300 border border-gray-100 group"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6d5738] rounded-lg flex items-center justify-center text-white font-bold shadow-md text-sm group-hover:scale-110 transition-transform">
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-gray-900 mb-1 group-hover:text-[#EC6426] transition-colors truncate">
                                            {branch.name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-[#EC6426]/10 text-[#EC6426] text-xs font-bold rounded-md">
                                                {branch.orders.toLocaleString()} đơn
                                            </span>
                                            {parseFloat(branch.growth) >= 0 ? (
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-md flex items-center gap-0.5">
                                                    <ArrowUpRight size={10} />
                                                    +{branch.growth}%
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-md flex items-center gap-0.5">
                                                    <ArrowDownRight size={10} />
                                                    {branch.growth}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold bg-gradient-to-r from-[#EC6426] to-[#F8A91F] bg-clip-text text-transparent">
                                            {(branch.revenue / 1000000).toFixed(1)}M
                                        </p>
                                        <p className="text-xs text-gray-500 font-semibold">VNĐ</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </AdminGuard>
    );
}
