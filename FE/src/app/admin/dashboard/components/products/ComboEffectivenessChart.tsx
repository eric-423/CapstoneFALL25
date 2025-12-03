"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ComboEffectivenessItem } from '@/apis/dashboard.api';
import { Loader2, Inbox, Layers } from 'lucide-react';

interface ComboEffectivenessChartProps {
    data: ComboEffectivenessItem[];
    isLoading?: boolean;
}

export default function ComboEffectivenessChart({ data, isLoading }: ComboEffectivenessChartProps) {
    const hasData = data && data.length > 0 && data.some(d => d.orders > 0 || d.revenue > 0);

    return (
        <div className="bg-gradient-to-br from-white/80 to-[#EBD187]/10 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-[#78A243]/20 h-full">
            <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-[#EBD187]/20">
                    <Layers className="h-4 w-4 text-[#DA7339]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2D1E1A]">Hiệu Quả Combo</h3>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#78A243]" />}
            </div>
            <p className="text-sm text-[#2D1E1A]/60 mb-6">So sánh số lượng bán và doanh thu của các Combo</p>

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
                            <p className="text-sm font-medium text-[#2D1E1A]/70">Chưa có dữ liệu combo</p>
                            <p className="text-xs text-[#2D1E1A]/50 mt-1">Hiệu quả combo sẽ hiển thị tại đây</p>
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
                                dataKey="comboName"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#2D1E1A', fontSize: 12, fontWeight: 500 }}
                                width={120}
                            />
                            <Tooltip
                                cursor={{ fill: '#78A243', opacity: 0.1 }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255,255,255,0.95)',
                                    borderColor: '#78A243',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="orders" name="Số lượng bán" fill="#78A243" radius={[0, 4, 4, 0]} barSize={20} />
                            <Bar dataKey="revenue" name="Doanh thu" fill="#DA7339" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
