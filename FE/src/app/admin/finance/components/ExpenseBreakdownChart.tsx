'use client';

import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign } from 'lucide-react';

interface ExpenseBreakdownChartProps {
    data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
}

export function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
    const COLORS = ['#EC6426', '#F8A91F', '#1A3F22', '#632713', '#10b981', '#3b82f6'];

    // Custom label
    type PieLabelEntry = { value: number };
    const renderCustomLabel = (entry: PieLabelEntry) => {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        const percent = ((entry.value / total) * 100).toFixed(1);
        return `${percent}%`;
    };

    // Custom tooltip
    type TooltipPayload = { name?: string; value?: number; payload?: unknown; color?: string };
    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] | null }) => {
        if (active && payload && payload.length) {
            const first = payload[0];
            const total = data.reduce((sum, item) => sum + item.value, 0);
            const value = typeof first.value === 'number' ? first.value : 0;
            const name = typeof first.name === 'string' ? first.name : '';
            return (
                <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-2xl">
                    <p className="font-bold text-gray-900 mb-2 text-sm">{name}</p>
                    <p className="text-sm font-semibold text-[#EC6426]">{(value / 1000000).toFixed(1)}M đ</p>
                    <p className="text-xs text-gray-500 mt-1">{((value / total) * 100).toFixed(1)}% tổng chi phí</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="p-8 border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Phân tích chi phí</h2>
            </div>

            <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomLabel}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            animationDuration={1000}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            wrapperStyle={{ fontSize: '13px', fontWeight: '600' }}
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Expense Details */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                {data.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-full shadow-sm"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-semibold text-gray-700 text-sm">{item.name}</span>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900 text-sm">
                                {(item.value / 1000000).toFixed(1)}M đ
                            </p>
                            <p className="text-xs text-gray-500">
                                {((item.value / data.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t-2 border-gray-200 flex items-center justify-between">
                <span className="font-bold text-gray-900">Tổng chi phí</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    {(data.reduce((sum, item) => sum + item.value, 0) / 1000000).toFixed(1)}M đ
                </span>
            </div>
        </Card>
    );
}
