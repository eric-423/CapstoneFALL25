'use client';

import { Card } from '@/components/ui/card';
import { Store } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface BranchData {
    name: string;
    value: number;
}

interface BranchPieChartProps {
    data: BranchData[];
}

const COLORS = ['#EC6426', '#F8A91F', '#FF9F43', '#2E7D32', '#4CAF50'];

export function BranchPieChart({ data }: BranchPieChartProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        Doanh thu theo chi nhánh
                    </h3>
                    <p className="text-sm text-gray-500">Phân bố doanh thu các chi nhánh</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Store className="text-white" size={24} />
                </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <defs>
                        {COLORS.map((color, index) => (
                            <linearGradient key={index} id={`branchGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={1} />
                                <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                            </linearGradient>
                        ))}
                    </defs>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="45%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={`url(#branchGradient-${index})`}
                                stroke="white"
                                strokeWidth={3}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        }}
                        labelStyle={{ color: '#111827', fontWeight: 'bold', marginBottom: '8px' }}
                        formatter={(value: number) => [
                            <span key="value" className="font-bold text-primary">
                                {value.toLocaleString('vi-VN')} ₫
                            </span>,
                            'Doanh thu'
                        ]}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={50}
                        formatter={(value, entry) => {
                            const percentage = ((entry.payload?.value / total) * 100).toFixed(1);
                            return (
                                <span className="text-sm font-semibold text-gray-700">
                                    {value} ({percentage}%)
                                </span>
                            );
                        }}
                        iconType="circle"
                        iconSize={12}
                    />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
}
