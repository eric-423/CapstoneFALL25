'use client';

import { NewCustomerStatistics } from '@/apis/statistics.api';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

interface CustomerGrowthChartProps {
    data?: NewCustomerStatistics;
}

export function CustomerGrowthChart({ data }: CustomerGrowthChartProps) {
    const comparisonLabel = data?.comparisonType === 'MONTHLY' ? 'Tháng trước' : 'Hôm qua';
    const chartData = [
        {
            label: 'Hôm nay',
            value: data?.newCustomersToday ?? 0,
            fill: '#EC6426',
        },
        {
            label: comparisonLabel,
            value: data?.newCustomersComparison ?? 0,
            fill: '#F59E0B',
        },
    ];

    const difference = data?.difference ?? 0;
    const percentage = data?.percentageChange ?? 0;

    return (
        <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        Tăng trưởng khách hàng mới
                    </h3>
                    <p className="text-sm text-gray-500">So sánh với {comparisonLabel.toLowerCase()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="text-white" size={24} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData} barSize={48}>
                        <defs>
                            <linearGradient id="customerToday" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#EC6426" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#F97316" stopOpacity={0.7} />
                            </linearGradient>
                            <linearGradient id="customerComparison" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#FBBF24" stopOpacity={0.7} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                        <XAxis
                            dataKey="label"
                            stroke="#9ca3af"
                            style={{ fontSize: '13px', fontWeight: 600 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: '13px', fontWeight: 600 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                            allowDecimals={false}
                        />
                        <Tooltip
                            formatter={(value: number) => [
                                <span key="value" className="font-semibold text-gray-900">
                                    {value.toLocaleString('vi-VN')}
                                </span>,
                                'Khách hàng',
                            ]}
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            }}
                        />
                        <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                            <LabelList
                                dataKey="value"
                                position="top"
                                formatter={(value: number) => value.toLocaleString('vi-VN')}
                                style={{ fill: '#111827', fontWeight: 600 }}
                            />
                            <Cell fill="url(#customerToday)" />
                            <Cell fill="url(#customerComparison)" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border border-blue-100">
                    <p className="text-sm text-gray-500 mb-1">Chênh lệch</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                        {difference > 0 ? '+' : ''}
                        {difference.toLocaleString('vi-VN')}
                    </p>
                    <p className={`text-sm font-semibold ${percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {percentage >= 0 ? 'Tăng' : 'Giảm'} {Math.abs(percentage).toFixed(1)}%
                    </p>
                </div>
            </div>
        </Card>
    );
}
