'use client';

import { ServiceTimeStatistics } from '@/apis/statistics.api';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BranchOption {
    value: number;
    label: string;
}

interface ServiceTimeChartProps {
    data?: ServiceTimeStatistics;
    branches?: BranchOption[];
    selectedBranchId?: number | null;
    onBranchChange?: (branchId: number | null) => void;
    comparisonType: 'DAILY' | 'MONTHLY';
    onComparisonTypeChange?: (value: 'DAILY' | 'MONTHLY') => void;
    selectedDate: string;
    onDateChange?: (value: string) => void;
    isBranchLoading?: boolean;
}

const SLA_TARGET_MINUTES = 15;

export function ServiceTimeChart({
    data,
    branches = [],
    selectedBranchId,
    onBranchChange,
    comparisonType,
    onComparisonTypeChange,
    selectedDate,
    onDateChange,
    isBranchLoading,
}: ServiceTimeChartProps) {
    const comparisonLabel = data?.comparisonType === 'MONTHLY' ? 'Tháng trước' : 'Hôm qua';
    const chartData = [
        {
            label: 'Hiện tại',
            actual: data?.averageServiceTimeMinutes ?? 0,
            target: SLA_TARGET_MINUTES,
        },
        {
            label: comparisonLabel,
            actual: data?.comparisonAverageServiceTimeMinutes ?? 0,
            target: SLA_TARGET_MINUTES,
        },
    ];

    const difference = data?.differenceMinutes ?? 0;
    const isImproving = data ? data.percentageChange <= 0 : true;

    return (
        <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        Thời gian phục vụ
                    </h3>
                    <p className="text-sm text-gray-500">Mục tiêu SLA {SLA_TARGET_MINUTES} phút</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="text-white" size={24} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Chi nhánh</label>
                    <select
                        value={selectedBranchId ?? ''}
                        onChange={(e) => onBranchChange?.(e.target.value ? Number(e.target.value) : null)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        disabled={isBranchLoading}
                    >
                        <option value="">{isBranchLoading ? 'Đang tải...' : 'Chọn chi nhánh'}</option>
                        {branches.map((branch) => (
                            <option key={branch.value} value={branch.value}>
                                {branch.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Loại so sánh</label>
                    <select
                        value={comparisonType}
                        onChange={(e) => onComparisonTypeChange?.(e.target.value as 'DAILY' | 'MONTHLY')}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                        <option value="DAILY">So với hôm qua</option>
                        <option value="MONTHLY">So với tháng trước</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Ngày (yyyy-MM-dd)</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => onDateChange?.(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
                <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={chartData}>
                        <defs>
                            <linearGradient id="serviceTimeActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#C084FC" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="label"
                            stroke="#9ca3af"
                            style={{ fontSize: '13px', fontWeight: 600 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis
                            unit="p"
                            stroke="#9ca3af"
                            style={{ fontSize: '13px', fontWeight: 600 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                            domain={[0, Math.max(SLA_TARGET_MINUTES, ...(chartData.map((item) => item.actual))) + 5]}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                <span key="value" className="font-semibold text-gray-900">
                                    {value.toFixed(1)} phút
                                </span>,
                                name === 'actual' ? 'Thực tế' : 'Mục tiêu',
                            ]}
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            }}
                        />
                        <Legend
                            formatter={(value) => (value === 'actual' ? 'Thực tế' : 'SLA')}
                            iconType="circle"
                        />
                        <Bar
                            dataKey="actual"
                            barSize={32}
                            radius={[8, 8, 0, 0]}
                            fill="url(#serviceTimeActual)"
                        />
                        <Line
                            type="monotone"
                            dataKey="target"
                            stroke="#F87171"
                            strokeWidth={3}
                            dot={{ stroke: '#F87171', strokeWidth: 2 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>

                <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-5 border border-purple-100">
                    <p className="text-sm text-gray-500 mb-1">Chênh lệch</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                        {difference > 0 ? '+' : ''}
                        {difference.toFixed(1)} phút
                    </p>
                    <p className={`text-sm font-semibold ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
                        {isImproving ? 'Cải thiện' : 'Tăng'} {Math.abs(data?.percentageChange ?? 0).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-3">
                        Tổng đơn xử lý: {data?.totalOrdersProcessed?.toLocaleString('vi-VN') ?? '0'}
                    </p>
                </div>
            </div>
        </Card>
    );
}
