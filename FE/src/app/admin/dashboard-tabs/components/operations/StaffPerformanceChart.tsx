"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StaffPerformance } from '../../types';

interface StaffPerformanceChartProps {
    data: StaffPerformance[];
}

export default function StaffPerformanceChart({ data }: StaffPerformanceChartProps) {
    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full">
            <h3 className="text-lg font-semibold text-foreground mb-1">Hiệu Suất Nhân Viên</h3>
            <p className="text-sm text-muted-foreground mb-6">Số lượng đơn hàng xử lý bởi nhân viên</p>

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
                            dataKey="staffName"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 500 }}
                            width={100}
                        />
                        <Tooltip
                            cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                borderRadius: '8px'
                            }}
                            formatter={(value: number) => [value, 'Đơn hàng']}
                        />
                        <Bar dataKey="ordersHandled" radius={[0, 4, 4, 0]} barSize={25}>
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
