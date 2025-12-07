"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { KitchenPerformanceItem } from "@/apis/dashboard.api";
import { Loader2, Inbox, ChefHat } from "lucide-react";

interface KitchenPerformanceChartProps {
  data: KitchenPerformanceItem[];
  isLoading?: boolean;
}

export default function KitchenPerformanceChart({
  data,
  isLoading,
}: KitchenPerformanceChartProps) {
  const hasData =
    data && data.length > 0 && data.some((d) => d.avgPrepMinutes > 0);

  return (
    <div className="bg-white backdrop-blur-sm p-6 rounded-xl shadow-sm border border-grey-300 h-full">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-2 rounded-lg bg-[#DA7339]/10">
          <ChefHat className="h-4 w-4 text-[#DA7339]" />
        </div>
        <h3 className="text-lg font-semibold text-[#2D1E1A]">Hiệu Suất Bếp</h3>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-[#78A243]" />
        )}
      </div>
      <p className="text-sm text-[#2D1E1A]/60 mb-6">
        Thời gian chế biến trung bình theo khung giờ
      </p>

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
              <p className="text-sm font-medium text-[#2D1E1A]/70">
                Chưa có dữ liệu bếp
              </p>
              <p className="text-xs text-[#2D1E1A]/50 mt-1">
                Hiệu suất bếp sẽ hiển thị tại đây
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#78A243"
                strokeOpacity={0.2}
              />
              <XAxis
                dataKey="timeSlot"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#2D1E1A", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#2D1E1A", fontSize: 12 }}
                label={{
                  value: "Phút",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#2D1E1A",
                  fillOpacity: 0.6,
                }}
              />
              <Tooltip
                cursor={{ fill: "#78A243", opacity: 0.1 }}
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderColor: "#78A243",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number) => [`${value} phút`, "Thời gian TB"]}
              />
              <ReferenceLine
                y={15}
                stroke="#DA7339"
                strokeDasharray="3 3"
                label={{
                  value: "Mục tiêu (15p)",
                  fill: "#DA7339",
                  fontSize: 10,
                }}
              />
              <Bar
                dataKey="avgPrepMinutes"
                fill="#78A243"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
