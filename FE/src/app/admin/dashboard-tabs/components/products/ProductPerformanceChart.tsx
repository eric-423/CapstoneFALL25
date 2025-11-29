"use client";

import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { ProductSummary } from '../../types';

interface ProductPerformanceChartProps {
    data: ProductSummary[];
}

export default function ProductPerformanceChart({ data }: ProductPerformanceChartProps) {
    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full">
            <h3 className="text-lg font-semibold text-foreground mb-1">Hiệu Suất Sản Phẩm</h3>
            <p className="text-sm text-muted-foreground mb-6">Tương quan giữa Số lượng bán và Doanh thu</p>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis
                            type="number"
                            dataKey="quantitySold"
                            name="Số lượng"
                            unit=" món"
                            label={{ value: 'Số lượng bán', position: 'bottom', offset: 0, fill: 'var(--muted-foreground)', fontSize: 12 }}
                            tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="totalRevenue"
                            name="Doanh thu"
                            unit="₫"
                            label={{ value: 'Doanh thu', angle: -90, position: 'left', offset: 0, fill: 'var(--muted-foreground)', fontSize: 12 }}
                            tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                        />
                        <ZAxis type="number" dataKey="quantitySold" range={[60, 400]} />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-card border border-border p-3 rounded-lg shadow-md">
                                            <p className="font-semibold text-foreground mb-1">{data.productName}</p>
                                            <p className="text-sm text-muted-foreground">Bán: {data.quantitySold}</p>
                                            <p className="text-sm text-primary font-medium">
                                                Thu: ₫{data.totalRevenue.toLocaleString()}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Scatter name="Products" data={data} fill="var(--primary)" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
