"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StaffPerformanceItem } from '@/apis/dashboard.api';
import { Loader2, Inbox, Users } from 'lucide-react';

interface StaffPerformanceChartProps {
    data: StaffPerformanceItem[];
    isLoading?: boolean;
}

// Admin color palette for bars
const CHART_COLORS = ['#78A243', '#DA7339', '#EBD187', '#6B8E23', '#CD853F'];

export default function StaffPerformanceChart({ data, isLoading }: StaffPerformanceChartProps) {
    const hasData = data && data.length > 0 && data.some(d => d.ordersHandled > 0);

    return (
        <div className="bg-gradient-to-br from-white/80 to-[#EBD187]/10 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-[#78A243]/20">
            <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-[#78A243]/10">
                    <Users className="h-4 w-4 text-[#78A243]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2D1E1A]">Hiệu Suất Nhân Viên</h3>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#78A243]" />}
            </div>
            <p className="text-sm text-[#2D1E1A]/60 mb-6">Số lượng đơn hàng xử lý bởi nhân viên</p>

            <div className="h-[300px] w-full">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EBD187]/10 to-[#78A243]/5 rounded-lg animate-pulse">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-[#78A243] mx-auto mb-2" />
                            <p className="text-sm text-[#2D1E1A]/60">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                ) : !hasData ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#EBD187]/30 to-[#78A243]/10 flex items-center justify-center mb-3">
                                <Inbox className="h-8 w-8 text-[#78A243]/60" />
                            </div>
                            <p className="text-sm font-medium text-[#2D1E1A]/70">Chưa có dữ liệu nhân viên</p>
                            <p className="text-xs text-[#2D1E1A]/50 mt-1">Hiệu suất nhân viên sẽ hiển thị tại đây</p>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#78A243" strokeOpacity={0.2} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="staffName"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#2D1E1A', fontSize: 12, fontWeight: 500 }}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: '#78A243', opacity: 0.1 }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255,255,255,0.95)',
                                    borderColor: '#78A243',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                formatter={(value: number) => [value, 'Đơn hàng']}
                            />
                            <Bar dataKey="ordersHandled" radius={[0, 4, 4, 0]} barSize={25}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
