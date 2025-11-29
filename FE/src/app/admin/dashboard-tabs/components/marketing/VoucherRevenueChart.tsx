"use client";

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { VoucherRevenue } from '../../types';

interface VoucherRevenueChartProps {
    data: VoucherRevenue[];
}

export default function VoucherRevenueChart({ data }: VoucherRevenueChartProps) {
    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full">
            <h3 className="text-lg font-semibold text-foreground mb-1">Doanh Thu Voucher</h3>
            <p className="text-sm text-muted-foreground mb-6">Tỷ trọng doanh thu theo loại Voucher</p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="revenue"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill || `var(--color-chart-${index + 1})`} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`₫${value.toLocaleString()}`, 'Doanh thu']}
                        />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
