"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PromotionPerformance } from '../../types';

interface PromotionPerformanceChartProps {
    data: PromotionPerformance[];
}

export default function PromotionPerformanceChart({ data }: PromotionPerformanceChartProps) {
    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full">
            <h3 className="text-lg font-semibold text-foreground mb-1">Hiệu Quả Khuyến Mãi</h3>
            <p className="text-sm text-muted-foreground mb-6">Doanh thu tạo ra từ các mã giảm giá</p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="code"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 600 }}
                            width={100}
                        />
                        <Tooltip
                            cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`₫${value.toLocaleString()}`, 'Doanh thu']}
                        />
                        <Bar dataKey="revenueGenerated" radius={[0, 4, 4, 0]} barSize={30}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`var(--color-chart-${(index % 5) + 1})`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
