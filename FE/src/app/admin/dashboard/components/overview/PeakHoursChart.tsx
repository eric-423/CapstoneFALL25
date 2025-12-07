"use client";

import React, { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PeakHoursItem } from "@/apis/dashboard.api";
import { Loader2, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PeakHoursChartProps {
  data: PeakHoursItem[];
  isLoading?: boolean;
}

function PeakHoursChart({ data, isLoading }: PeakHoursChartProps) {
  const hasData = data && data.length > 0 && data.some((d) => d.orderCount > 0);

  return (
    <Card className="p-5 rounded-xl bg-white backdrop-blur-sm border-grey-300 border shadow-sm h-full">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-base font-bold text-[#2D1E1A]">Khung Giờ Vàng</h3>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-[#78A243]" />
        )}
      </div>
      <p className="text-xs text-[#2D1E1A]/60 mb-5">
        Lượng đơn hàng trung bình theo giờ
      </p>

      <div className="h-[300px] w-full">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-[#EBD187]/10 rounded-lg animate-pulse">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#78A243] mx-auto mb-2" />
              <p className="text-sm text-[#2D1E1A]/60">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : !hasData ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Inbox className="h-12 w-12 text-[#78A243]/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-[#2D1E1A]/70">
                Chưa có dữ liệu
              </p>
              <p className="text-xs text-[#2D1E1A]/50 mt-1">
                Dữ liệu khung giờ sẽ hiển thị tại đây
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
                strokeOpacity={0.15}
              />
              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#2D1E1A", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#2D1E1A", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "#EBD187", opacity: 0.2 }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid rgba(120, 162, 67, 0.3)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value: number) => [value, "Đơn hàng"]}
              />
              <Bar
                dataKey="orderCount"
                fill="#DA7339"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

export default memo(PeakHoursChart);
